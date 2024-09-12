import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { query } from "@/libs/db";
import bcrypt from "bcryptjs";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        id: { label: "User ID", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        // const { id, password } = credentials;

        if (!credentials?.id|| !credentials?.password) {
          return null;
        }

        try {
          const users = await query({
            query: "SELECT * FROM employees WHERE id = ?",
            values: [credentials.id],
          });

          if (users.length === 0) {
            return null;
          }

          const user = users[0];
          const match = await bcrypt.compare(credentials.password, user.password);

          if (!match) {
            return null;
          }

          return { id: user.id, name: user.name, position: user.position };

        } catch (error) {
          console.error("Login error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 hours
  },
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true
      }
    },
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
      if (token){
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.position = token.position;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
});