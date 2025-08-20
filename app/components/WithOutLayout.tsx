"use client"
import { usePathname } from "next/navigation";
import CustomLayout from "./CustomLayout";
import { ReactNode } from "react";

export default function WithOutLayout({ children, role, balance }: { children: ReactNode, role?: 'admin' | 'merchant' | 'staff', balance:string }) {
  const pathname = usePathname();
  const isLoginPage = pathname.startsWith('/login');
  const isHonePage = pathname === ('/');
  const isServerDownPage = pathname === ('/server-down');
  const isPaymentPage = pathname === ('/payment');

  

  return isLoginPage || isHonePage || isServerDownPage || isPaymentPage? children : <CustomLayout role={role} balance={balance}>{children}</CustomLayout>;
}