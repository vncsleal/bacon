import { createAuth } from "@repo/database/convex/auth";
import { getToken } from "@convex-dev/better-auth/nextjs";
import { SidebarProvider } from "@repo/design-system/components/ui/sidebar";
import { showBetaFeature } from "@repo/feature-flags";
import { secure } from "@repo/security";
import { fetchQuery } from "convex/nextjs";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { api } from "@repo/database/convex/_generated/api";
import { env } from "@/env";
import { NotificationsProvider } from "./components/notifications-provider";
import { GlobalSidebar } from "./components/sidebar";

type AppLayoutProperties = {
  readonly children: ReactNode;
};

const AppLayout = async ({ children }: AppLayoutProperties) => {
  if (!env.NEXT_PUBLIC_CONVEX_URL) {
    redirect("/sign-in");
  }

  if (env.ARCJET_KEY) {
    await secure(["CATEGORY:PREVIEW"]);
  }

  const token = await getToken(createAuth);

  if (!token) {
    redirect("/sign-in");
  }

  const user = await fetchQuery(api.auth.getCurrentUser, {}, { token });
  const betaFeature = await showBetaFeature();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <NotificationsProvider userId={user._id as string}>
      <SidebarProvider>
        <GlobalSidebar>
          {betaFeature && (
            <div className="m-4 rounded-full bg-blue-500 p-1.5 text-center text-sm text-white">
              Beta feature now available
            </div>
          )}
          {children}
        </GlobalSidebar>
      </SidebarProvider>
    </NotificationsProvider>
  );
};

export default AppLayout;
