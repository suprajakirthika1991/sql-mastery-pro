// Copyright © 2026 Supraja Kali Vaidyanathan. All rights reserved.
// You may use, run, and share this software, but you may not modify,
// sublicense, or use it for commercial purposes without written permission.

// Auth is not required — all progress is stored client-side via localStorage.
// This file is a stub to satisfy imports; NextAuth is not active.
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [],
};
