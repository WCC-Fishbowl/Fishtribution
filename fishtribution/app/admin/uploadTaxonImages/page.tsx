'use client';

// NOTE: this page must be run in Chrome with --disable-web-security --user-data-dir=/tmp/chrome-dev in order to avoid a CORS error

import { useRef, useState } from 'react';

type Result = { taxonId: string; url: string; status: number | null; ok: boolean; detail: string };

export default function BulkUploadPage() {
  const [text, setText] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [running, setRunning] = useState(false);
  const abortRef = useRef(false);

  const parseLines = (raw: string) =>
    raw
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith('#'))
      .map((l) => l.split(/[,\t]/).map((s) => s.trim().replace(/^["']|["']$/g, '')))
      .filter((parts) => parts.length >= 2 && parts[0] && parts[1])
      .map(([taxonId, url]) => ({ taxonId, url }));

  const runUpload = async () => {
    const items = parseLines(text);
    if (!items.length) return alert('Nothing parsed — expected lines like: taxonId,url');

    abortRef.current = false;
    setRunning(true);
    setResults([]);

    for (const item of items) {
      if (abortRef.current) break;
      try {
        // download the image from its URL (this runs in the browser)
        const imgRes = await fetch(item.url);
        if (!imgRes.ok) throw new Error(`download failed: ${imgRes.status}`);
        const blob = await imgRes.blob();

        // wrap it as a File so the API sees what it expects
        const filename = item.url.split('/').pop()?.split('?')[0] || `${item.taxonId}.jpg`;

        const formData = new FormData();
        formData.append('file', new File([blob], filename, { type: blob.type || 'image/jpeg' }));
        formData.append('taxonId', item.taxonId);

        const res = await fetch('/api/taxon_upload', { method: 'POST', body: formData });
        const body = await res.json().catch(() => ({}));
        setResults((prev) => [...prev, {
          ...item,
          status: res.status,
          ok: res.ok,
          detail: body.error ?? 'OK',
        }]);
      } catch (err) {
        setResults((prev) => [...prev, { ...item, status: null, ok: false, detail: String(err) }]);
      }
    }

    setRunning(false);
  };

  const failed = results.filter((r) => !r.ok).length;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <h1 className="text-xl font-bold">Bulk image upload</h1>
      <p className="text-sm opacity-70">One line per upload: <code>taxonId,url</code>. Blank lines and #comments ignored.</p>

      <textarea
        className="w-full h-48 border p-2 font-mono text-sm"
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={running}
        placeholder={'12345,https://example.com/img/12345.jpg\n12346,https://example.com/img/12346.jpg'}
      />

      <div className="flex gap-2 items-center">
        <button onClick={runUpload} disabled={running || !text} className="bg-purple-600 text-white px-4 py-2 rounded">
          {running ? 'Uploading…' : `Upload ${parseLines(text).length} items`}
        </button>
        <button onClick={() => (abortRef.current = true)} disabled={!running} className="border px-4 py-2 rounded">
          Abort
        </button>
        {results.length > 0 && (
          <span className="text-sm">{results.filter((r) => r.ok).length} OK · {failed} failed</span>
        )}
      </div>

      {results.length > 0 && (
        <table className="w-full text-sm border-collapse">
          <thead><tr className="text-left border-b"><th>Taxon</th><th>Status</th><th>Detail</th></tr></thead>
          <tbody>
            {results.map((r, i) => (
              <tr key={i} className="border-b" style={r.ok ? undefined : { color: '#c00' }}>
                <td>{r.taxonId}</td>
                <td>{r.status ?? 'ERR'}</td>
                <td className="font-mono text-xs truncate max-w-md">{r.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
