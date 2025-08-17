"use client"
import { usePathname } from "next/navigation";
import CustomLayout from "./CustomLayout";
import { ReactNode } from "react";

export default function WithOutLayout({ children, role }: { children: ReactNode, role?: 'admin' | 'merchant' | 'staff' }) {
  const pathname = usePathname();
  const isLoginPage = pathname.startsWith('/login');
  const isHonePage = pathname === ('/');
  const isServerDownPage = pathname === ('/server-down');

  

  return isLoginPage || isHonePage || isServerDownPage? children : <CustomLayout role={role}>{children}</CustomLayout>;
}