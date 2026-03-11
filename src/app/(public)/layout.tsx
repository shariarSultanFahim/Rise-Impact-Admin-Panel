import type { ReactNode } from "react";

import { withLayout, withPublicRoute } from "@/helpers/with-route-guard";

function PublicShell({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

async function PublicLayoutContent({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

const PublicLayout = withPublicRoute(withLayout(PublicLayoutContent, PublicShell));

export default PublicLayout;
