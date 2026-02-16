"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Bell,
  BookOpen,
  ChartAreaIcon,
  ClipboardClock,
  GraduationCap,
  HeartHandshake,
  LayoutDashboard,
  LogOut,
  Medal,
  MessageCircle,
  Notebook,
  UserRoundPen
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail
} from "@/components/ui/sidebar";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const data = {
  info: {
    title: "Rise & Impact",
    subtitle: "Instructor Portal"
  },
  navMain: [
    {
      title: "",
      items: [
        {
          title: "Overview",
          url: "/overview",
          icon: LayoutDashboard
        },
        {
          title: "User Management",
          url: "/user-management",
          icon: ClipboardClock
        },
        {
          title: "Course",
          url: "/courses",
          icon: BookOpen
        },
        {
          title: "Gradebook",
          url: "/gradebook",
          icon: GraduationCap
        },
        {
          title: "Discussions",
          url: "/discussions",
          icon: MessageCircle
        },
        { title: "Quiz Builder", url: "/quiz-builder", icon: Notebook },
        {
          title: "Notifications",
          url: "/notifications",
          icon: Bell
        },
        {
          title: "Analytics",
          url: "/analytics",
          icon: ChartAreaIcon
        },
        {
          title: "Feedback",
          url: "/feedback",
          icon: HeartHandshake
        },
        {
          title: "Gamification",
          url: "/gamification",
          icon: Medal
        },
        {
          title: "Terms & Conditions",
          url: "/terms",
          icon: UserRoundPen
        }
      ]
    }
  ],
  navSec: [
    {
      title: "Footer",
      items: [
        {
          title: "Profile",
          url: "#",
          icon: UserRoundPen
        },
        {
          title: "Support",
          url: "#",
          icon: HeartHandshake
        }
      ]
    }
  ]
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Image src="/logo.png" alt="Logo" width={32} height={32} />
                </div>
                <div className="grid flex-1 text-sm leading-tight">
                  <span className="truncate text-sm font-bold">{data.info.title}</span>
                  <span className="truncate text-xs font-semibold text-sidebar-foreground/60">
                    {data.info.subtitle}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      className="data-[active=true]:bg-white/25 data-[active=true]:text-primary-foreground data-[active=true]:shadow-md data-[active=true]:backdrop-blur-sm"
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem className="space-y-5">
            <div className="hidden flex-col gap-4 group-data-[collapsible=icon]:flex">
              <Avatar size="lg" className="h-8 w-8">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
            <div className="group-data-[collapsible=icon]:hidden">
              <div className="flex items-center justify-start gap-4">
                <Avatar size="lg">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold">John Doe</h2>
                  <h3 className="text-sm text-white/30">john@riseimpact.com</h3>
                </div>
              </div>
            </div>
            <SidebarMenuButton asChild className="group-data-[collapsible=icon]:w-full">
              <Link
                href="/login"
                className="h-10 w-full border border-secondary bg-transparent group-data-[collapsible=icon]:p-0 hover:border-white/20 hover:bg-white/25 hover:text-primary-foreground hover:shadow-md hover:backdrop-blur-sm"
              >
                <button className="flex w-full items-center justify-center gap-2 border-none">
                  <LogOut className="size-4 group-data-[collapsible=icon]:h-5 group-data-[collapsible=icon]:w-5" />
                  <span className="group-data-[collapsible=icon]:hidden">Sign Out</span>
                </button>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
