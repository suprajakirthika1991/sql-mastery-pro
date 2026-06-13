import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const SYSTEM = `You are the AI Tutor inside SQL Mastery Pro… (port full prompt from prototype). Hint-first; SQL in fences; use the app's tables.`;

export async function POST(req: Request) {
  const { messages } = await req.json(); // [{role:'user'|'assistant', content:string}]
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const resp = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1000,
    system: SYSTEM,
    messages,
  });
  const text = resp.content.filter((b) => b.type === "text").map((b) => (b as { text: string }).text).join("\n");
  return NextResponse.json({ text });
}
