import json

# Sample JSON data (can be loaded via json.load() from a file)
with open("sql/data/fish_taxa.json", "r") as file:
    json_data = json.load(file)

table_name = "fish_taxa"
sql_statements = []

for item in json_data:
    columns = ", ".join(item.keys())
    
    # Format and escape values properly for SQL
    val_list = []
    for v in item.values():
        if v is None:
            val_list.append("NULL")
        elif isinstance(v, (int, float)):
            val_list.append(str(v))
        else:
            # Escape single quotes by doubling them up
            escaped_val = str(v).replace("'", "''")
            val_list.append(f"'{escaped_val}'")
            

    values = ", ".join(val_list)
    sql_statements.append(f"INSERT INTO {table_name} ({columns}) VALUES ({values});")

# Save statements to a file
filepath = "sql/generated/insert_fish_taxa.sql"
with open(filepath, "w", encoding="utf-8") as f:
    f.write("\n".join(sql_statements))

print(f"Successfully generated into {filepath}.")
