"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Database, Sheet, Code, Hotel } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

const navItems = [
  { href: "/sql-practice", label: "SQL Practice", icon: Database },
  { href: "/spreadsheet-analysis", label: "Spreadsheet Analysis", icon: Sheet },
  { href: "/python-environment", label: "Python Environment", icon: Code },
  { href: "/hotel-analysis", label: "Hotel Analysis", icon: Hotel },
];

export function AppSidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={pathname === item.href}
              tooltip={item.label}
            >
              <Link href={item.href}>
                <Icon />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
