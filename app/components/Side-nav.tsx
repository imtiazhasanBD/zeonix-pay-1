// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import {
//   DatabaseZap,
//   LayoutDashboard,
//   ArrowRightLeft,
//   Send,
//   Landmark,
//   Settings,
//   ChevronDown,
// } from "lucide-react";

// import {
//   Sidebar,
//   SidebarHeader,
//   SidebarContent,
//   SidebarMenu,
//   SidebarMenuItem,
//   SidebarMenuButton,
//   SidebarFooter,
//   SidebarTrigger,
//   SidebarMenuSub,
//   SidebarMenuSubItem,
//   SidebarMenuSubButton,
// } from "@/components/ui/sidebar";
// import { cn } from "@/lib/utils";
// import React, { useEffect, useState } from "react";
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible";

// const navItems = [
//   { href: "/", icon: LayoutDashboard, label: "Dashboard" },
//   { href: "/cash-in", icon: ArrowRightLeft, label: "Cash In" },
//   { href: "/payment-transfer", icon: Send, label: "Payment Transfer" },
//   { 
//     href: "/payment-withdrawal", 
//     icon: Landmark, 
//     label: "Payment Withdrawal",
//     subItems: [
//       { href: "/payment-withdrawal/request", label: "Request Withdrawal" },
//       { href: "/payment-withdrawal/report", label: "Withdrawal Report" },
//       { href: "/payment-withdrawal/methods", label: "Payment Methods" },
//     ]
//   },
//   { href: "/settings", icon: Settings, label: "Settings" },
// ];

// export function SideNav() {
//   const pathname = usePathname();
//   const [activeSubItem, setActiveSubItem] = useState("");
//   const [isCollapsed, setIsCollapsed] = useState(false);

//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       const handleHashChange = () => {
//         setActiveSubItem(window.location.hash);
//       };

//       handleHashChange(); // Set initial state
//       window.addEventListener('hashchange', handleHashChange);

//       return () => {
//         window.removeEventListener('hashchange', handleHashChange);
//       };
//     }
//   }, [pathname]);

//   return (
//     <Sidebar 
//       className="transition-all duration-300"
//     >
//       <SidebarHeader className="flex items-start justify-between">
//         <Link href="/dashboard" className="flex items-center gap-2">
//           <DatabaseZap className="w-6 h-6 text-primary" />
//           <h1 className={cn(
//             "font-bold text-lg text-foreground font-headline",
//             isCollapsed ? "hidden" : "block"
//           )}>
//             FlowPanel
//           </h1>
//         </Link>
//         <SidebarTrigger 
//           className="p-1 rounded-md hover:bg-accent"
//           onClick={() => setIsCollapsed(!isCollapsed)}
//         />
//       </SidebarHeader>
//       <SidebarContent>
//         <SidebarMenu>
//           {navItems.map((item) => (
//             <SidebarMenuItem key={item.href}>
//               {item.subItems ? (
//                 <Collapsible>
//                   <CollapsibleTrigger asChild>
//                     <SidebarMenuButton
//                       variant="default"
//                       className={cn(
//                         "w-full justify-start",
//                         isCollapsed ? "justify-center" : "justify-start"
//                       )}
//                       isActive={pathname.startsWith(item.href)}
//                     >
//                       <item.icon />
//                       {!isCollapsed && (
//                         <>
//                           <span>{item.label}</span>
//                           <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
//                         </>
//                       )}
//                     </SidebarMenuButton>
//                   </CollapsibleTrigger>
//                   {!isCollapsed && (
//                     <CollapsibleContent>
//                       <SidebarMenuSub>
//                         {item.subItems.map(subItem => (
//                           <SidebarMenuSubItem key={subItem.href}>
//                             <SidebarMenuSubButton 
//                               href={subItem.href} 
//                               isActive={pathname + activeSubItem === subItem.href}
//                             >
//                               {subItem.label}
//                             </SidebarMenuSubButton>
//                           </SidebarMenuSubItem>
//                         ))}
//                       </SidebarMenuSub>
//                     </CollapsibleContent>
//                   )}
//                 </Collapsible>
//               ) : (
//                 <SidebarMenuButton
//                   asChild
//                   isActive={pathname === item.href}
//                   tooltip={isCollapsed ? item.label : undefined}
//                   className={isCollapsed ? "justify-center" : "justify-start"}
//                 >
//                   <Link href={item.href}>
//                     <item.icon />
//                     {!isCollapsed && <span>{item.label}</span>}
//                   </Link>
//                 </SidebarMenuButton>
//               )}
//             </SidebarMenuItem>
//           ))}
//         </SidebarMenu>
//       </SidebarContent>
//       <SidebarFooter className={isCollapsed ? "hidden" : "block"}>
//         <div className="p-4 text-xs text-center text-sidebar-foreground/50">
//           © {new Date().getFullYear()} FlowPanel
//         </div>
//       </SidebarFooter>
//     </Sidebar>
//   );
// }

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DatabaseZap,
  LayoutDashboard,
  ArrowRightLeft,
  Send,
  Landmark,
  Settings,
  ChevronRight,
  LogOut,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible";
import Image from "next/image";

const navItems = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/cash-in", icon: ArrowRightLeft, label: "Cash In" },
  { href: "/payment-transfer", icon: Send, label: "Payment Transfer" },
  {
    href: "/payment-withdrawal",
    icon: Landmark,
    label: "Payment Withdrawal",
    subItems: [
      { href: "/payment-withdrawal/request", label: "Request Withdrawal" },
      { href: "/payment-withdrawal/report", label: "Withdrawal Report" },
      { href: "/payment-withdrawal/methods", label: "Payment Methods" },
    ]
  },
  {
    href: "/payment-link",
    icon: Landmark,
    label: "Payment Link",
    subItems: [
      { href: "/payment-link/create", label: "Create Payment Link" },
      { href: "/payment-link/list", label: "All List" },
    ]
  },
  { href: "/settings", icon: Settings, label: "Settings" },
];

type SideNavProps = {
  collapsed: boolean;
  toggleSidebar: () => void;
};

export function SideNav({ collapsed, toggleSidebar }: SideNavProps) {
  const pathname = usePathname();
  const [activeSubItem, setActiveSubItem] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleHashChange = () => {
        setActiveSubItem(window.location.hash);
      };
      const checkMobile = () => setIsMobile(window.innerWidth < 1024);

      handleHashChange();
      checkMobile();

      window.addEventListener('hashchange', handleHashChange);
      window.addEventListener('resize', checkMobile);

      return () => {
        window.removeEventListener('hashchange', handleHashChange);
        window.removeEventListener('resize', checkMobile);
      };
    }
  }, [pathname]);


  return (
    <>
      {/* Overlay */}
      {!collapsed && isMobile && (
        <div
          onClick={toggleSidebar}
          className="w-full h-screen inset-0 z-30 bg-black opacity-70 fixed lg:hidden"
        ></div>
      )}

      {/* Sidebar */}
      <aside

        className={`fixed h-screen z-40 px-2 bg-white shadow-md transition-all duration-300 ease-in-out ${collapsed ? "w-20" : "w-72 sm:w-80 lg:w-64"
          } ${isMobile ? (collapsed ? "-translate-x-full" : "translate-x-0") : ""
          }`}
      >
        <div className="flex flex-col gap-2 h-full">
          {/* Logo/Header */}
          <div className={`flex items-center px-4 py-4 ${collapsed ? "justify-center" : "justify-start gap-2"
            }`}>
            <div className={`p-1 rounded-sm text-blue-600 text-3xl ${collapsed ? "" : "hidden"}`}>
              <Image
                src="/Zeonix-icon.png"
                width={32}
                height={32}
                alt="zeonix-logo"
              />
            </div>
            <div className={`flex items-center ${collapsed ? "hidden" : "flex"}`}>
              <Image src="/zeonix-logo.png" width={32} height={32} 
                alt="zeonix-logo" />
            </div>
            {!collapsed && (
              <div className="flex flex-col leading-tight">
                <img
                  src="/zeonix-logo.png"
                  alt="zeonix-logo" />
                <p className="text-[10px] text-gray-500 text-right">
                  Payment Management System
                </p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto">
            <ul className="space-y-1 px-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  {item.subItems ? (
                    <Collapsible>
                      <CollapsibleTrigger asChild>
                        <button
                          className={`w-full flex items-center p-3 rounded-md hover:text-customViolet font-medium transition-colors ${pathname.startsWith(item.href) ? "text-white bg-customViolet hover:text-gray-900" : "text-gray-700"
                            } ${collapsed ? "justify-center" : "justify-between"
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon size={18} />
                            {!collapsed && <span>{item.label}</span>}
                          </div>
                          {!collapsed && (
                            <ChevronRight
                              size={16}
                              className="transition-transform group-data-[state=open]:rotate-90"
                            />
                          )}
                        </button>
                      </CollapsibleTrigger>
                      {!collapsed && (
                        <CollapsibleContent>
                          <ul className="ml-2 pl-7 border-l-2 border-gray-100 space-y-1">
                            {item.subItems.map(subItem => (
                              <li key={subItem.href}>
                                <Link
                                  href={subItem.href}
                                  className={`block p-2 text-sm rounded-md hover:bg-gray-100 hover:text-customViolet transition-colors ${pathname + activeSubItem === subItem.href
                                      ? "text-customViolet font-medium"
                                      : "text-gray-600"
                                    }`}
                                >
                                  {subItem.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </CollapsibleContent>
                      )}
                    </Collapsible>
                  ) : (
                    <Link
                      href={item.href}
                      className={`flex items-center p-3 rounded-md hover:text-customViolet  transition-colors ${pathname === item.href ? "bg-customViolet  hover:text-gray-900 text-white font-medium" : "text-gray-700 font-medium"
                        } ${collapsed ? "justify-center" : "gap-3"
                        }`}
                    >
                      <item.icon size={18} />
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer/Logout */}
          <div className={`p-4 ${collapsed ? "text-center" : ""}`}>
            <button
              onClick={() => console.log('Logout')}
              className={`flex items-center text-gray-700 hover:text-primary transition-colors ${collapsed ? "justify-center mx-auto" : "gap-3"
                }`}
            >
              <LogOut size={18} />
              {!collapsed && <span className="text-sm font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}