// Copyright © 2026 Supraja Kali Vaidyanathan. All rights reserved.
// You may use, run, and share this software, but you may not modify,
// sublicense, or use it for commercial purposes without written permission.

"use client";
import { useEffect, useRef, useState } from "react";
import type { SqlJsStatic, Database } from "sql.js";
import { SEED } from "@/content/datasets";

type Row = Record<string, unknown>;

const SAMPLES = [
  { t: "All employees", q: "SELECT * FROM employees;" },
  { t: "Joins", q: "SELECT o.id, c.name, o.order_date, o.status\nFROM orders o JOIN customers c ON c.id = o.customer_id;" },
  { t: "Revenue by category", q: "SELECT p.category, SUM(oi.quantity * oi.unit_price) AS revenue\nFROM order_items oi JOIN products p ON p.id = oi.product_id\nGROUP BY p.category ORDER BY revenue DESC;" },
  { t: "Above-average pay", q: "SELECT name, salary FROM employees\nWHERE salary > (SELECT AVG(salary) FROM employees);" },
  { t: "Window: rank", q: "SELECT name, department_id, salary,\n  DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) AS dept_rank\nFROM employees\nORDER BY department_id, dept_rank;" },
  { t: "Running total", q: "SELECT o.order_date,\n  SUM(oi.quantity * oi.unit_price) AS order_revenue,\n  SUM(SUM(oi.quantity * oi.unit_price)) OVER (ORDER BY o.order_date) AS running_total\nFROM orders o JOIN order_items oi ON oi.order_id = o.id\nGROUP BY o.id, o.order_date\nORDER BY o.order_date;" },
];

function buildDB(SQL: SqlJsStatic): Database {
  const db = new SQL.Database();
  for (const [table, data] of Object.entries(SEED)) {
    const cols = Object.keys(data[0]);
    const types = cols.map((c) => (typeof data[0][c] === "number" ? "NUMERIC" : "TEXT"));
    db.run(`CREATE TABLE ${table} (${cols.map((c, i) => `${c} ${types[i]}`).join(", ")})`);
    const stmt = db.prepare(`INSERT INTO ${table} VALUES (${cols.map(() => "?").join(",")})`);
    for (const r of data) stmt.run(cols.map((c) => (r[c] ?? null) as never));
    stmt.free();
  }
  return db;
}

function ResultTable({ rows }: { rows: Row[] }) {
  if (!rows.length) return <div className="okbox">Query ran — 0 rows returned.</div>;
  const cols = Object.keys(rows[0]);
  return (
    <div>
      <div className="results">
        <table className="grid">
          <thead><tr>{cols.map((c) => <th key={c}>{c}</th>)}</tr></thead>
          <tbody>
            {rows.slice(0, 200).map((r, i) => (
              <tr key={i}>{cols.map((c) => <td key={c}>{r[c] == null ? <span className="muted">NULL</span> : String(r[c])}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>
        {rows.length} row{rows.length === 1 ? "" : "s"}{rows.length > 200 ? " (showing first 200)" : ""}
      </div>
    </div>
  );
}

export default function PlaygroundPage() {
  const [sql, setSql] = useState("SELECT * FROM employees;");
  const [output, setOutput] = useState<{ rows?: Row[]; error?: string } | null>(null);
  const [sqlLib, setSqlLib] = useState<SqlJsStatic | null>(null);
  const dbRef = useRef<Database | null>(null);

  useEffect(() => {
    const pending = sessionStorage.getItem("sqlmastery:pendingSQL");
    if (pending) { setSql(pending); sessionStorage.removeItem("sqlmastery:pendingSQL"); }
  }, []);

  useEffect(() => {
    import("sql.js").then((m) => {
      const initSqlJs = m.default;
      initSqlJs({ locateFile: (f: string) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.0/${f}` })
        .then((SQL) => { setSqlLib(SQL); dbRef.current = buildDB(SQL); })
        .catch(() => {});
    });
  }, []);

  const runQuery = () => {
    if (!dbRef.current) return;
    try {
      const res = dbRef.current.exec(sql);
      if (!res.length) {
        setOutput({ rows: [] });
        if (/\b(insert|update|delete|drop|alter|create)\b/i.test(sql) && sqlLib) {
          dbRef.current = buildDB(sqlLib);
        }
      } else {
        const last = res[res.length - 1];
        const rows = last.values.map((v) => Object.fromEntries(last.columns.map((c, i) => [c, v[i]])));
        setOutput({ rows });
      }
    } catch (e: unknown) {
      setOutput({ error: String(e instanceof Error ? e.message : e) });
    }
  };

  const resetData = () => {
    if (!sqlLib) return;
    dbRef.current = buildDB(sqlLib);
    setOutput(null);
  };

  const downloadCSV = () => {
    if (!output?.rows?.length) return;
    const cols = Object.keys(output.rows[0]);
    const lines = [cols.join(","), ...output.rows.map((r) =>
      cols.map((c) => { const v = r[c] == null ? "" : String(r[c]); return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v; }).join(",")
    )];
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "results.csv"; a.click();
  };

  return (
    <div className="pg-grid">
      <div>
        <div className="pad-wrap">
          <div className="bar">
            <span className="dots"><i /><i /><i /></span>
            query editor · Ctrl/Cmd+Enter to run
          </div>
          <textarea
            className="sqlpad"
            value={sql}
            onChange={(e) => setSql(e.target.value)}
            spellCheck={false}
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); runQuery(); }
              if (e.key === "Tab") {
                e.preventDefault();
                const ta = e.currentTarget;
                const s = ta.selectionStart;
                const newSql = sql.slice(0, s) + "  " + sql.slice(ta.selectionEnd);
                setSql(newSql);
                setTimeout(() => { ta.selectionStart = ta.selectionEnd = s + 2; }, 0);
              }
            }}
          />
        </div>
        <div className="row" style={{ margin: "10px 0 16px" }}>
          <button className="btn primary" onClick={runQuery} disabled={!sqlLib}>▶ Run query</button>
          <button className="btn ghost small" onClick={downloadCSV}>Download CSV</button>
          <button className="btn ghost small" onClick={resetData}>Reset data</button>
        </div>
        {!output && (
          <div className="muted" style={{ fontSize: "13.5px" }}>
            Results will appear here. Real SQLite running in your browser — joins, GROUP BY, subqueries, CTEs, and full window-function support.
            {!sqlLib && <span> (Loading SQL engine…)</span>}
          </div>
        )}
        {output?.error && <div className="errbox">Error: {output.error}</div>}
        {output?.rows !== undefined && !output.error && <ResultTable rows={output.rows} />}
      </div>

      <div>
        <div className="eyebrow">Datasets</div>
        <div className="card">
          {Object.entries(SEED).map(([table, data]) => (
            <div key={table} className="schema-item">
              <span className="tn" onClick={() => setSql(`SELECT * FROM ${table};`)}>{table}</span>{" "}
              <span className="muted">· {data.length} rows</span>
              <div className="cols">{Object.keys(data[0]).join(", ")}</div>
            </div>
          ))}
        </div>
        <div className="eyebrow" style={{ marginTop: 16 }}>Sample queries</div>
        <div className="row" style={{ flexWrap: "wrap" }}>
          {SAMPLES.map((s, i) => (
            <button key={i} className="sample-chip" onClick={() => setSql(s.q)}>{s.t}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
