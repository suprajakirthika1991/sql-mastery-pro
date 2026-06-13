"use client";
// In-browser SQLite playground — same engine and approach as the prototype.
// User SQL NEVER reaches the server: no injection surface, infinite-loop risk stays in the tab.
import { useEffect, useRef, useState } from "react";
import initSqlJs, { Database } from "sql.js";
import { SEED } from "@/content/datasets";

export default function SqlPlayground({ initialSql = "SELECT * FROM employees;" }: { initialSql?: string }) {
  const dbRef = useRef<Database | null>(null);
  const [sql, setSql] = useState(initialSql);
  const [rows, setRows] = useState<Record<string, unknown>[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initSqlJs({ locateFile: (f) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.0/${f}` }).then((SQL) => {
      const db = new SQL.Database();
      for (const [table, data] of Object.entries(SEED)) {
        const cols = Object.keys(data[0]);
        db.run(`CREATE TABLE ${table} (${cols.map((c) => `${c} ${typeof data[0][c] === "number" ? "NUMERIC" : "TEXT"}`).join(", ")})`);
        const stmt = db.prepare(`INSERT INTO ${table} VALUES (${cols.map(() => "?").join(",")})`);
        for (const r of data) stmt.run(cols.map((c) => (r[c] ?? null) as never));
        stmt.free();
      }
      dbRef.current = db;
    });
  }, []);

  function run() {
    try {
      setError(null);
      const res = dbRef.current?.exec(sql) ?? [];
      const last = res[res.length - 1];
      setRows(last ? last.values.map((v) => Object.fromEntries(last.columns.map((c, i) => [c, v[i]]))) : []);
    } catch (e) {
      setRows(null);
      setError((e as Error).message);
    }
  }

  return (
    <div>
      <textarea value={sql} onChange={(e) => setSql(e.target.value)} rows={6}
        className="w-full rounded-xl bg-code-bg p-4 font-mono text-sm text-code-ink" spellCheck={false} />
      <button onClick={run} className="mt-3 rounded-lg bg-accent px-4 py-2 font-semibold text-white">Run query</button>
      {error && <pre className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</pre>}
      {rows && (
        <div className="mt-3 overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead><tr>{rows[0] && Object.keys(rows[0]).map((c) => <th key={c} className="bg-accent-soft px-3 py-2 text-left font-mono text-xs text-accent">{c}</th>)}</tr></thead>
            <tbody>{rows.map((r, i) => <tr key={i}>{Object.values(r).map((v, j) => <td key={j} className="border-t px-3 py-1.5">{String(v ?? "NULL")}</td>)}</tr>)}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
