import { PrismaAdapter } from "@auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({ clientId: process.env.GOOGLE_CLIENT_ID!, clientSecret: process.env.GOOGLE_CLIENT_SECRET! }),
    GitHubProvider({ clientId: process.env.GITHUB_ID!, clientSecret: process.env.GITHUB_SECRET! }),
  ],
  callbacks: {
    session({ session, token }) {
      if (session.user) (session.user as { id?: string }).id = token.sub;
      return session;
    },
  },
};
