// lib/auth.ts
import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions";


declare module 'next-auth' {
  interface Session {
    user: {
      name: string;
      email: string;
      role: 'admin' | 'user';
    };
    accessToken: string;
  }

  interface User {
    role: 'admin' | 'user';
    token: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: 'admin' | 'user';
    accessToken: string;
  }
}


export async function getUserRole(): Promise<'admin' | 'user' | 'staff' | null> {
  const session = await getServerSession(authOptions);
  console.log("session", session)
  return session?.user?.role ?? null;
}