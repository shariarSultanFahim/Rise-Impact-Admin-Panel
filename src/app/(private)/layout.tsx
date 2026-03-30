import type { ReactNode } from "react";

import { withLayout, withPrivateRoute } from "@/helpers/with-route-guard";

import { Separator } from "@/components/ui";
import { DynamicBreadcrumb } from "@/components/ui/dynamic-breadcrumb";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/(private)/app-sidebar";

function PrivateShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <DynamicBreadcrumb />
        </header>
        <div className="flex flex-1 flex-col gap-4 overflow-y-hidden p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

async function PrivateLayoutContent({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

const PrivateLayout = withPrivateRoute(withLayout(PrivateLayoutContent, PrivateShell), {
  redirectTo: "/login"
});

export default PrivateLayout;
