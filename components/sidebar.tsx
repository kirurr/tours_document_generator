"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, FileText, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { authClient } from "@/lib/auth-client";

const navigation = [
  { name: "Главная", href: "/", icon: LayoutDashboard },
  { name: "Туристы", href: "/tourist", icon: Users },
  { name: "Шаблоны", href: "/template", icon: FileText },
  { name: "Туры", href: "/tour", icon: Briefcase },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { data } = authClient.useSession();
  const user = data?.user;

  return (
    <div className="w-64 border-r border-border bg-card relative">
      <div className="flex flex-col sticky top-0 h-screen w-full">
        <div className="flex h-16 items-center border-b border-border px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground">
              TourDocs
            </span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto p-4 flex flex-row items-center justify-between wrap">
          <div className="flex items-center gap-2">
            <div className="size-10 rounded-full bg-primary text-background flex items-center justify-center text-xl">
              {user?.name[0]}
            </div>
            <span className="text-lg">{user?.name}</span>
          </div>
          <Button variant="outline">Выйти</Button>
        </div>
      </div>
    </div>
  );
}
