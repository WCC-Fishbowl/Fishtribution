#!/usr/bin/env python3
"""
Generate batched SQL migrations from CSV files for Neon PostgreSQL + PostGIS.
Multi-row INSERTs with bounded batch sizes to limit per-statement overhead.
"""

import csv
from datetime import datetime
from pathlib import Path
from typing import List, Optional, Sequence


class SQLBatchGenerator:
    def __init__(
        self,
        batch_size: int = 1000,
        on_conflict: Optional[str] = None,  # e.g. "DO NOTHING" or "DO UPDATE SET ..."
        postgis_enabled: bool = True,
    ):
        self.batch_size = batch_size
        self.on_conflict = on_conflict
        self.postgis_enabled = postgis_enabled
        self.lines: List[str] = []

    # ---------- value formatting ----------

    @staticmethod
    def esc(value) -> str:
        if value is None:
            return "NULL"
        s = str(value)
        if s == "":
            return "''"
        return "'" + s.replace("'", "''") + "'"

    @classmethod
    def nvl(cls, value) -> str:
        """Escape as string, or NULL if empty."""
        if value is None or str(value).strip() == "":
            return "NULL"
        return cls.esc(value)

    @classmethod
    def num(cls, value) -> str:
        if value is None or str(value).strip() == "":
            return "NULL"
        return str(float(value))  # validates numeric; raises on garbage

    @classmethod
    def ts(cls, value, default="CURRENT_TIMESTAMP") -> str:
        if value is None or str(value).strip() == "":
            return default
        datetime.fromisoformat(str(value).replace("Z", "+00:00"))  # validate
        return cls.esc(value)

    def point(self, lat, lon) -> str:
        if lat in (None, "") or lon in (None, ""):
            return "NULL"
        lat_f, lon_f = float(lat), float(lon)  # validate
        assert -90 <= lat_f <= 90, f"bad latitude {lat}"
        assert -180 <= lon_f <= 180, f"bad longitude {lon}"
        return f"ST_SetSRID(ST_MakePoint({lon_f!r}, {lat_f!r}), 4326)::geography"

    # ---------- batch writer ----------

    def emit_batches(self, table: str, columns: Sequence[str],
                     rows: List[List[str]]) -> int:
        """Emit multi-row INSERTs, committing per batch."""
        count = 0
        for start in range(0, len(rows), self.batch_size):
            chunk = rows[start:start + self.batch_size]
            tuples = ",\n".join("(" + ", ".join(r) + ")" for r in chunk)
            conflict = f"\nON CONFLICT {self.on_conflict}" if self.on_conflict else ""
            self.lines.append(
                f"INSERT INTO {table} ({', '.join(columns)})\nVALUES\n{tuples}{conflict};\n"
            )
            count += len(chunk)
        return count

    # ---------- table loaders ----------

    def users_row(self, row: dict) -> List[str]:
        return [
            self.nvl(row.get("user_id")),
            self.esc(row.get("username", "")),
            self.esc(row.get("email", "")),
            self.esc(row.get("display_name", "")),
            self.esc(row.get("role", "angler")),
            "CURRENT_TIMESTAMP",
            "CURRENT_TIMESTAMP",
        ]

    def catches_row(self, row: dict) -> List[str]:
        return [
            self.nvl(row.get("catch_id")),
            self.nvl(row.get("user_id")),
            self.nvl(row.get("taxon_id")),
            self.num(row.get("weight_kg")),      # NULL if absent
            self.num(row.get("length_cm")),
            self.nvl(row.get("bait_or_lure")),
            self.nvl(row.get("notes")),
            self.ts(row.get("caught_at")),
            "CURRENT_TIMESTAMP",
            "CURRENT_TIMESTAMP",
            "NULL",                               # deleted_at
            self.point(row.get("latitude"), row.get("longitude")),
        ]

    def load_csv(self, path: Path, row_fn) -> List[List[str]]:
        with open(path, newline="", encoding="utf-8") as f:
            return [row_fn(r) for r in csv.DictReader(f)]

    def write(self, path: Path):
        header = [
            "-- Migration: add_synthetic_catches",
            f"-- Generated: {datetime.now().isoformat()}",
            "-- Target: Neon PostgreSQL with PostGIS",
            "",
        ]
        path.write_text("\n".join(header + self.lines), encoding="utf-8")
        print(f"Wrote {path}")


def main():
    users_csv = Path("sql/generated/users.csv")
    catches_csv = Path("sql/generated/realistic_catches.csv")
    out = Path("sql/generated/001_add_synthetic_data.sql")

    gen = SQLBatchGenerator(
        batch_size=1000,
        on_conflict="DO NOTHING",   # idempotent re-runs; change if you want upserts
    )

    gen.lines.append("-- ===== users =====\n")
    gen.emit_batches(
        "users",
        ["user_id", "username", "email", "display_name", "role",
         "created_at", "updated_at"],
        gen.load_csv(users_csv, gen.users_row),
    )

    gen.lines.append("-- ===== catches =====\n")
    gen.emit_batches(
        "catches",
        ["catch_id", "user_id", "taxon_id", "weight_kg", "length_cm",
         "bait_or_lure", "notes", "caught_at", "created_at", "updated_at",
         "deleted_at", "pos"],
        gen.load_csv(catches_csv, gen.catches_row),
    )

    gen.write(out)


if __name__ == "__main__":
    main()