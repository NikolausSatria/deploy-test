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
          throw new Error("User ID and Password are Required");
        }

        try {
          const users = await query({
            query: "SELECT * FROM employees WHERE id = ?",
            values: [userId],
          });

          if (users.length === 0) {
            throw new Error("No User Found");
          }

          const user = users[0];
          const match = await bcrypt.compare(password, user.password);

          if (!match) {
            throw new Error("Password incorrect");
          }

          return { id: user.id, name: user.name, position: user.position };

        } catch (error) {
          console.error("Login error:", error);
          throw new Error("Error when trying to Login");
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.SECRET,
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60,
    updateAge: 2 * 60 * 60,
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
