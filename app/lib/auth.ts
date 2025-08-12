// lib/auth.ts
import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions";


declare module 'next-auth' {
  interface Session {
    user: {
      name: string;
      email: string;
      role: 'admin' | 'merchant' | 'staff';
    };
    accessToken: string;
  }

  interface User {
    role: 'admin' | 'merchant' | 'staff';
    token: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: 'admin' | 'merchant' | 'staff';
    accessToken: string;
  }
}


export async function getUserRole(): Promise<'admin' | 'merchant' | 'staff' | null> {
  const session = await getServerSession(authOptions);
  console.log("session", session)
  return session?.user?.role ?? null;
}