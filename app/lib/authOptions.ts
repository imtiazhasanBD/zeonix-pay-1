import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log(credentials);
        if (!credentials) return null;

        try {
          const res = await fetch((`${process.env.NEXTAUTH_URL}/auth/admin/login`), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password,
            }),
          });

          if (!res.ok) {
            return null; 
          }
          const user = await res.json();
console.log("uuerrrrrrrrrrr: ",user)
          return {
            id: String(user.user),
            name: user.username,
            email: user.email ?? "",
            token: user.token.access, 
            refreshToken: user.token.refresh, 
            role: user.token.role === "Admin" ? "admin" : "user", 
          };
        } catch (error) {
          console.error("Login error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.accessToken = user.token;
        console.log("token call:", token);
      }
      return token; 
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as "admin" | "user";
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
