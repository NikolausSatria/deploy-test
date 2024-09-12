import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { query } from "@/libs/db";
import bcrypt from "bcryptjs";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        userId: { label: "User ID", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const { userId, password } = credentials;

        if (!userId || !password) {
          throw new Error("User ID and Password are required");
        }

        try {
          const users = await query({
            query: "SELECT * FROM employees WHERE id = ?",
            values: [userId],
          });

          if (users.length === 0) {
            throw new Error("No user found");
          }

          const user = users[0];

          const match = await bcrypt.compare(password, user.password);

          if (!match) {
            throw new Error("Password incorrect");
          }

          // Return user object as per NextAuth.js requirements
          return { id: user.id, name: user.name, position: user.position };

        } catch (error) {
          console.error("Login error:", error.message);
          throw new Error("Error when trying to login");
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 hours
    updateAge: 2 * 60 * 60, // 2 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.position = user.position;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = session.user || {};
      if (token.id) session.user.id = token.id;
      if (token.name) session.user.name = token.name;
      if (token.position) session.user.position = token.position;
      return session;
    },
  },
});
