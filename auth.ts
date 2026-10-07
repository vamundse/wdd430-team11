import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { authConfig } from "./auth.config";
import { getUserByEmail } from "@/lib/users";

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,

  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = z
          .object({
            email: z.string().email(),
            password: z.string().min(6),
          })
          .safeParse(credentials);

        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        const user = await getUserByEmail(email);

        if (!user || !user.passwordHash) return null;

        const passwordsMatch = await bcrypt.compare(
          password,
          user.passwordHash
        );

        if (!passwordsMatch) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],

  callbacks: {
    ...authConfig.callbacks,

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },

    async session({ session, token }) {
      const userId = token.id ?? token.sub;
      if (session.user && userId) {
        session.user.id = userId as string;
      }

      return session;
    },
  },
});