"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  ClipboardList,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  {
    href: "/work",
    label: "作業一覧",
    icon: ClipboardList,
  },
  {
    href: "/aggregation",
    label: "工数集計",
    icon: BarChart3,
  },
  {
    href: "/admin",
    label: "システム管理",
    icon: Settings,
    adminOnly: true,
  },
];

export function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isAdmin = user?.system_privilege === "システム管理者";

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const filteredNavItems = navItems.filter(
    (item) => !item.adminOnly || (item.adminOnly && isAdmin)
  );

  if (pathname === "/login" || pathname.startsWith("/password-reset")) {
    return null;
  }

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 md:px-8">
        <Link href="/work" className="mr-6 flex items-center">
          <LayoutDashboard className="h-6 w-6 mr-2" />
          <span className="text-xl font-bold">WorkTrack</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4 flex-1">
          {filteredNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                pathname === item.href || pathname.startsWith(`${item.href}/`)
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile Navigation */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] sm:w-[300px]">
            <div className="flex justify-between items-center mb-6">
              <Link
                href="/work"
                className="flex items-center"
                onClick={() => setOpen(false)}
              >
                <LayoutDashboard className="h-5 w-5 mr-2" />
                <span className="font-semibold">WorkTrack</span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex flex-col space-y-3">
              {filteredNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center py-2 px-3 rounded-md transition-colors",
                    pathname === item.href ||
                      pathname.startsWith(`${item.href}/`)
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                >
                  <item.icon className="mr-2 h-5 w-5" />
                  {item.label}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>

        {/* User Info & Logout */}
        <div className="ml-auto flex items-center space-x-4">
          {user && (
            <div className="flex items-center">
              <div className="hidden md:block text-sm mr-4">
                <span className="text-muted-foreground mr-2">
                  {user.department_id
                    ? getDepartmentName(user.department_id)
                    : ""}
                </span>
                <span className="font-medium">{user.name}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                <span>ログアウト</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getDepartmentName(departmentId: number): string {
  const departments = {
    1: "営業部",
    2: "開発部",
    3: "カスタマーサポート部",
    4: "人事部",
    5: "総務部",
  };

  return departments[departmentId as keyof typeof departments] || "";
}
