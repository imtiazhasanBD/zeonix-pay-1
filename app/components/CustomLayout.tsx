"use client";

import { useState } from "react";
import { SideNav } from "./Side-nav";
import { Header } from "./Header";


import { ReactNode } from "react";

interface CustomLayoutProps {
  children: ReactNode;
}

const CustomLayout = ({ children, role }: { children: ReactNode, role?: 'admin' | 'merchant' | 'staff' })  => {

  const [collapsed, setCollapsed] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 1024 : false
  );

  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <div className="flex bg-gray-100 min-h-screen gap-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
      <SideNav role={role} collapsed={collapsed} toggleSidebar={toggleSidebar} />
      <div className={`flex flex-col w-full transition-all duration-300 ease-in-out`}>
        <Header role={role} collapsed={collapsed} toggleSidebar={toggleSidebar} />
        <main className={`flex-1 p-4 md:p-6 ${collapsed ? 'lg:ml-20' : 'lg:ml-68'} transition-all duration-300 ease-in-out scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100`}>{children}</main>
      </div>
    </div>
  );
};

export default CustomLayout;