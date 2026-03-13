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
  Scale,
  UserRoundPen
} from "lucide-react";
import { toast } from "sonner";

import { AUTH_SESSION_COOKIE } from "@/constants/auth";

import { useGetUsersProfile } from "@/lib/api/profile/get-profile";
import { cookie } from "@/lib/cookie-client";

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

import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";

const data = {
  info: {
    title: "Rise & Impact",
    subtitle: "Admin Portal"
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
          title: "Legal",
          url: "/terms",
          icon: Scale
        },
        {
          title: "Profile",
          url: "/profile",
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

  const rootPath = pathname.split("/")[1];

  const handleSignOut = () => {
    cookie.remove(AUTH_SESSION_COOKIE);
  };

  const getUsersProfileQuery = useGetUsersProfile();

  React.useEffect(() => {
    if (getUsersProfileQuery.isError) {
      toast.error("Unable to load profile data.");
    }
  }, [getUsersProfileQuery.isError]);

  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
                  <Image src="/logo.png" alt="Logo" width={32} height={32} />
                </div>
                <div className="grid flex-1 text-sm leading-tight">
                  <span className="truncate text-lg font-bold">{data.info.title}</span>
                  <span className="truncate text-xs font-semibold text-sidebar-foreground/60">
                    {data.info.subtitle}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      {/* <Separator /> */}
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
                      isActive={rootPath === item.url.split("/")[1]}
                      className="data-[active=true]:bg-white/25 data-[active=true]:text-primary-foreground data-[active=true]:shadow-md data-[active=true]:backdrop-blur-sm"
                    >
                      <Link href={item.url} className="py-5">
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
      {/* <Separator /> */}
      {getUsersProfileQuery.data && (
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem className="space-y-5">
              <div className="hidden flex-col gap-4 group-data-[collapsible=icon]:flex">
                <Avatar size="lg" className="h-8 w-8">
                  <AvatarImage src={getUsersProfileQuery.data.profilePicture} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
              <div className="group-data-[collapsible=icon]:hidden">
                <div className="flex items-center justify-start gap-4">
                  <Avatar size="lg">
                    <AvatarImage src={getUsersProfileQuery.data.profilePicture} />
                    <AvatarFallback>
                      {getUsersProfileQuery.data.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-semibold">{getUsersProfileQuery.data.name}</h2>
                    <h3 className="text-sm text-white/30">{getUsersProfileQuery.data.email}</h3>
                  </div>
                </div>
              </div>
              <SidebarMenuButton asChild className="group-data-[collapsible=icon]:w-full">
                <Link
                  href="/login"
                  onClick={handleSignOut}
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
      )}
      <SidebarRail />
    </Sidebar>
  );
}
