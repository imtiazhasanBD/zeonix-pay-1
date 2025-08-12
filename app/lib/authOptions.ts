// lib/authOptions.ts
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

interface APIUser {
  id: number;
  username: string;
  email?: string;
  token: string;
}

interface AppUser extends APIUser {
  role: 'admin' | 'merchant' | 'staff';
}

declare module 'next-auth' {
  interface Session {
    user: {
      name: string;
      email: string;
      role: 'admin' | 'merchant' | 'staff';
    };
    accessToken: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: 'admin' | 'merchant' | 'staff';
    accessToken: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
        role: { label: 'Role', type: 'text' },
      },
      async authorize(credentials): Promise<any> {
        console.log(credentials);
        
        if (!credentials) return null;

        // Map role to correct API URL
        const endpointMap: Record<string, string> = {
          merchant: 'http://192.168.68.134:8000/api/v1/auth/merchant/login/',
          admin: 'http://192.168.68.134:8000/api/v1/auth/admin/login/',
          staff: 'http://192.168.68.134:8000/api/v1/auth/staff/login/',
        };

        const apiUrl = endpointMap[credentials.role as string];
        if (!apiUrl) return null;

        try {
          const res = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password,
            }),
          });

          if (!res.ok) return null;

          const user: APIUser = await res.json();
console.log('User dataaaaaa:', user);
          return {
            ...user,
            role: credentials.role as 'admin' | 'merchant' | 'staff',
          } as any;
        } catch (error) {
          console.error('Login error:', error);
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
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as 'admin' | 'merchant' | 'staff';
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};
