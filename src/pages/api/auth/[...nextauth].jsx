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
          // Query user from the database
          const users = await query({
            query: "SELECT * FROM employees WHERE id = ?",
            values: [userId],
          });

          if (users.length === 0) {
            throw new Error("No user found");
          }

          const user = users[0];

          // Compare passwords
          const match = await bcrypt.compare(password, user.password);

          if (!match) {
            throw new Error("Password incorrect");
          }

          // Return user object if authorized
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
    signOut: '/login',
    error: '/login?error=true', 
  },
  secret: process.env.NEXTAUTH_SECRET, // Update to NEXTAUTH_SECRET
  trustHost: true,
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
      if (token) {
        session.user = {
          id: token.id,
          name: token.name,
          position: token.position,
        };
      }
      return session;
    },
  },
});
