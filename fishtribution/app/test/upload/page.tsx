"use client";

import { useState } from "react";

export default function TestUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("catchId", '0000c1be-eaae-4d07-ae1c-3c10979c450b');

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    setResult(`Status: ${res.status}\n${JSON.stringify(await res.json(), null, 2)}`);
  }

  return (
    <div>
      <p className="text-3xl font-bold p-4">Upload Test</p>
      <form onSubmit={onSubmit}>
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <button type="submit">Upload</button>
        {result && <pre>{result}</pre>}
      </form>
    </div>
  );
}
