// Copyright © 2026 Supraja Kali Vaidyanathan. All rights reserved.
// You may use, run, and share this software, but you may not modify,
// sublicense, or use it for commercial purposes without written permission.

"use client";
import { useState, useEffect, useRef } from "react";
import { CHALLENGES } from "@/content/challenges";
import { SEED } from "@/content/datasets";
import { useProgress } from "@/lib/useProgress";
import type { SqlJsStatic, Database } from "sql.js";

type Row = Record<string, unknown>;

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

function execOnDB(db: Database, sql: string): Row[] {
  const res = db.exec(sql);
  if (!res.length) return [];
  const last = res[res.length - 1];
  return last.values.map((v) => Object.fromEntries(last.columns.map((c, i) => [c, v[i]])));
}

function normalizeRows(rows: Row[], ordered: boolean): string {
  const mapped = rows.map((r) =>
    Object.values(r).map((v) => (typeof v === "number" ? Math.round(v * 100) / 100 : v ?? null)).join("\x01")
  );
  if (!ordered) mapped.sort();
  return mapped.join("\x02");
}

function ResultTable({ rows }: { rows: Row[] }) {
  if (!rows.length) return <div className="okbox">Query ran — 0 rows returned.</div>;
  const cols = Object.keys(rows[0]);
  return (
    <div className="results">
      <table className="grid">
        <thead><tr>{cols.map((c) => <th key={c}>{c}</th>)}</tr></thead>
        <tbody>
          {rows.slice(0, 200).map((r, i) => (
            <tr key={i}>{cols.map((c) => <td key={c}>{r[c] == null ? <span className="muted">NULL</span> : String(r[c])}</td>)}</tr>
          ))}
        </tbody>
      </table>
      <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>{rows.length} row{rows.length === 1 ? "" : "s"}</div>
    </div>
  );
}

export default function PracticePage() {
  const { progress, solveChallenge } = useProgress();
  const [selected, setSelected] = useState<string | null>(null);
  const [sqlInput, setSqlInput] = useState("");
  const [result, setResult] = useState<{ rows?: Row[]; error?: string; correct?: boolean } | null>(null);
  const [showSol, setShowSol] = useState(false);
  const [sqlLib, setSqlLib] = useState<SqlJsStatic | null>(null);

  useEffect(() => {
    import("sql.js").then((m) => {
      const initSqlJs = m.default;
      initSqlJs({ locateFile: (f: string) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.0/${f}` })
        .then((SQL) => setSqlLib(SQL))
        .catch(() => {});
    });
  }, []);

  const challenge = selected ? CHALLENGES.find((c) => c.slug === selected) : null;

  const handleCheck = () => {
    if (!sqlLib || !challenge) return;
    try {
      const db1 = buildDB(sqlLib);
      const db2 = buildDB(sqlLib);
      const userRows = execOnDB(db1, sqlInput);
      const solRows = execOnDB(db2, challenge.solution);
      const ok = normalizeRows(userRows, challenge.ordered) === normalizeRows(solRows, challenge.ordered);
      if (ok) solveChallenge(challenge.slug, challenge.xp);
      setResult({ rows: userRows, correct: ok });
      db1.close(); db2.close();
    } catch (e: unknown) {
      setResult({ error: String(e instanceof Error ? e.message : e) });
    }
  };

  if (!selected) {
    return (
      <>
        <div className="section spread">
          <div>
            <div className="eyebrow" style={{ margin: 0 }}>Coding challenges</div>
            <div className="muted" style={{ fontSize: 13 }}>
              {progress.solvedChallenges.length}/{CHALLENGES.length} solved · write a query, run it, get it auto-graded
            </div>
          </div>
        </div>
        <div className="card">
          {CHALLENGES.map((c, i) => {
            const dn = progress.solvedChallenges.includes(c.slug);
            return (
              <div key={c.slug} className="lesson-row" onClick={() => { setSelected(c.slug); setSqlInput(""); setResult(null); setShowSol(false); }}>
                <span className="num">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <div className="t">{c.title}</div>
                  <div className="meta">{c.tables.join(" · ")} · +{c.xp} XP</div>
                </div>
                <div className="right">
                  <span className={`badge ${c.level}`}>{c.level}</span>
                  <span className={`check ${dn ? "on" : ""}`}>✓</span>
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  }

  const dn = progress.solvedChallenges.includes(challenge!.slug);

  return (
    <>
      <button className="backlink" onClick={() => { setSelected(null); setResult(null); }}>← All challenges</button>
      <div className="row" style={{ marginBottom: 6 }}>
        <span className={`badge ${challenge!.level}`}>{challenge!.level}</span>
        <span className="muted" style={{ fontSize: "12.5px" }}>+{challenge!.xp} XP</span>
        {dn && <span className="badge done">✓ solved</span>}
      </div>
      <h2 style={{ fontSize: 22, marginBottom: 10 }}>{challenge!.title}</h2>
      <p style={{ marginBottom: 6 }} dangerouslySetInnerHTML={{ __html: challenge!.prompt }} />
      <p className="muted" style={{ fontSize: "12.5px", marginBottom: 14 }}>
        Tables: <span className="mono">{challenge!.tables.join(", ")}</span> — values must match.
        {challenge!.ordered ? " Row order matters for this one." : ""}
      </p>

      {challenge!.hints.map((hint, i) => (
        <details key={i} className="hint">
          <summary>Hint {i + 1}</summary>
          <div className="inner">{hint}</div>
        </details>
      ))}

      <div className="pad-wrap" style={{ marginTop: 14 }}>
        <div className="bar"><span className="dots"><i /><i /><i /></span>your solution · Ctrl/Cmd+Enter to run</div>
        <textarea
          className="sqlpad"
          value={sqlInput}
          onChange={(e) => setSqlInput(e.target.value)}
          onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); handleCheck(); } }}
          placeholder="-- Write your query here"
          spellCheck={false}
        />
      </div>

      <div className="row" style={{ margin: "10px 0 14px" }}>
        <button className="btn primary" onClick={handleCheck} disabled={!sqlLib}>▶ Run &amp; check</button>
        <button className="btn ghost small" onClick={() => setShowSol(!showSol)}>
          {showSol ? "Hide" : "Show"} solution
        </button>
      </div>

      {result && (
        <div>
          {result.error ? (
            <div className="errbox">Error: {result.error}</div>
          ) : (
            <>
              {result.correct === true && (
                <div className="okbox" style={{ marginBottom: 10 }}>✓ Correct! Your result matches the expected output.</div>
              )}
              {result.correct === false && (
                <div className="errbox" style={{ marginBottom: 10 }}>Not quite — check the hints and your column order.</div>
              )}
              {result.rows && <ResultTable rows={result.rows} />}
            </>
          )}
        </div>
      )}

      {showSol && (
        <>
          <div className="eyebrow" style={{ marginTop: 16 }}>Reference solution</div>
          <div className="term">
            <div className="bar"><span className="dots"><i /><i /><i /></span>sql</div>
            <pre>{challenge!.solution}</pre>
          </div>
        </>
      )}
    </>
  );
}
