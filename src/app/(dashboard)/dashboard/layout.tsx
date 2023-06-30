import * as React from "react";
import { siteConfig } from "@/config/site";
import AsideItem from "@/components/AsideItem";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { dashboardConfig } from "@/config/dashboard";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="container mt-2 grid w-full max-w-6xl gap-x-4 md:mt-4 md:grid-cols-[200px_1fr]">
      <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
        <ScrollArea className="flex gap-2 py-6 pr-6 lg:py-8">
          <div className="flex w-full flex-col gap-2">
            {Object.values(dashboardConfig.sidebarNav).map((el) => (
              <AsideItem
                key={el.title}
                title={el.title}
                Icon={el.Icon}
                href={el.href}
              />
            ))}
          </div>
        </ScrollArea>
      </aside>
      <main className="flex w-full flex-col overflow-hidden">{children}</main>
    </div>
  );
};

export default Layout;
