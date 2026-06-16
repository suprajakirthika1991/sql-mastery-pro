// Copyright © 2026 Supraja Kali Vaidyanathan. All rights reserved.
// You may use, run, and share this software, but you may not modify,
// sublicense, or use it for commercial purposes without written permission.

import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const SYSTEM = `You are the AI Tutor inside "SQL Mastery Pro", a SQL learning app. The learner is preparing for data engineering / analytics roles.

The app's playground runs SQLite with these tables:
- departments(id, name, location)
- employees(id, name, department_id, role, salary, hire_date, manager_id)
- customers(id, name, city, country, segment)
- products(id, name, category, price, stock)
- orders(id, customer_id, order_date 'YYYY-MM-DD', status)
- order_items(order_id, product_id, quantity, unit_price)

Rules:
- Be a warm, concise mentor. Keep answers short (under ~200 words) unless asked for depth.
- When the learner is stuck on a practice problem, give HINTS first, not the full answer. Reveal full solutions only if they explicitly ask.
- When reviewing a query, point out correctness issues first, then style, then performance.
- Put all SQL in \`\`\`sql code fences and prefer the app's tables in examples so the learner can run them in the Playground.
- When generating practice problems, state the expected output shape and offer a hint.`;

export async function POST(req: Request) {
  const { messages } = await req.json();
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const resp = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1000,
    system: SYSTEM,
    messages,
  });
  const text = resp.content
    .filter((b) => b.type === "text")
    .map((b) => (b as { text: string }).text)
    .join("\n");
  return NextResponse.json({ text });
}
