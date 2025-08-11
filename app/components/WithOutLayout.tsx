"use client"
import { usePathname } from "next/navigation";
import CustomLayout from "./CustomLayout";
import { ReactNode } from "react";

export default function WithOutLayout({ children, role }: { children: ReactNode, role?: 'admin' | 'user' | 'staff' }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  

  return isLoginPage ? children : <CustomLayout role={role}>{children}</CustomLayout>;
}