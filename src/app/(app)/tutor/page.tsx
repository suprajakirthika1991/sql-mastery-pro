// Copyright © 2026 Supraja Kali Vaidyanathan. All rights reserved.
// You may use, run, and share this software, but you may not modify,
// sublicense, or use it for commercial purposes without written permission.

"use client";
import { useState, useRef, useEffect } from "react";

interface Msg { role: "user" | "assistant"; content: string }

const CHIPS = [
  { t: "Explain LEFT JOIN simply", m: "Explain LEFT JOIN to me simply, with a small example I can run in the playground." },
  { t: "Quiz me: window functions", m: "Ask me one interview question about window functions, wait for my answer, then grade it." },
  { t: "Give me a practice problem", m: "Generate one medium-difficulty practice problem using the app tables. Give the problem and one hint, but not the solution yet." },
];

function mdLite(text: string): string {
  let h = text
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/```(?:sql)?\n?([\s\S]*?)```/g, (_, code) =>
      `<div class="term" style="margin:8px 0"><div class="bar"><span class="dots"><i></i><i></i><i></i></span>sql</div><pre>${code.trim()}</pre></div>`
    )
    .replace(/`([^`]+)`/g, '<code style="background:var(--accent-soft);padding:1px 5px;border-radius:5px;font-size:12.5px">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>")
    .replace(/\n/g, "<br>");
  return h;
}

export default function TutorPage() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const msgsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [msgs, busy]);

  async function send(text: string) {
    if (!text.trim() || busy) return;
    const next: Msg[] = [...msgs, { role: "user", content: text }];
    setMsgs(next);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMsgs((m) => [...m, { role: "assistant", content: data.text || "Sorry, I couldn't get a response." }]);
    } catch {
      setMsgs((m) => [...m, { role: "assistant", content: "Network error reaching the AI service. Check that ANTHROPIC_API_KEY is set in your environment." }]);
    }
    setBusy(false);
  }

  return (
    <div className="card" style={{ padding: 0, display: "flex", flexDirection: "column", minHeight: "55vh" }}>
      <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--line)" }}>
        <div style={{ fontWeight: 700, fontFamily: "Space Grotesk" }}>SQL Mentor</div>
        <div className="muted" style={{ fontSize: "12.5px" }}>
          Hint-first coaching, query reviews, custom practice problems. Knows the playground tables.
        </div>
      </div>

      <div ref={msgsRef} style={{ flex: 1, overflowY: "auto", padding: "16px 18px", maxHeight: "52vh" }}>
        {msgs.length === 0 && (
          <div className="muted" style={{ fontSize: "13.5px" }}>
            Ask me anything about SQL — or start with a quick action below.
          </div>
        )}
        {msgs.map((m, i) =>
          m.role === "user" ? (
            <div key={i} style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
              <div style={{
                background: "var(--accent)", color: "var(--accent-ink)", borderRadius: "14px 14px 4px 14px",
                padding: "10px 14px", maxWidth: "85%", fontSize: 14,
              }}>{m.content}</div>
            </div>
          ) : (
            <div key={i} style={{ display: "flex", marginBottom: 12 }}>
              <div
                style={{
                  background: "var(--surface)", border: "1px solid var(--line)",
                  borderRadius: "14px 14px 14px 4px", padding: "11px 14px",
                  maxWidth: "92%", fontSize: 14, lineHeight: 1.55,
                }}
                dangerouslySetInnerHTML={{ __html: mdLite(m.content) }}
              />
            </div>
          )
        )}
        {busy && <div className="muted" style={{ fontSize: 13 }}>Mentor is thinking…</div>}
      </div>

      <div style={{ padding: "12px 14px", borderTop: "1px solid var(--line)" }}>
        <div className="row" style={{ marginBottom: 10, flexWrap: "wrap" }}>
          {CHIPS.map((c, i) => (
            <button key={i} className="sample-chip" disabled={busy} onClick={() => send(c.m)}>{c.t}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <textarea
            rows={1}
            placeholder="Ask the mentor…"
            style={{
              flex: 1, resize: "none", border: "1px solid var(--line)", borderRadius: 10,
              padding: "10px 12px", fontFamily: "Inter", fontSize: 14,
              background: "var(--surface)", color: "var(--ink)",
            }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
          />
          <button className="btn primary" disabled={busy} onClick={() => send(input)}>Send</button>
        </div>
      </div>
    </div>
  );
}
