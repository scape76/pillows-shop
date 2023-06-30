"use client";

import { Store } from "@/db/schema";
import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface StoreTabsProps extends React.ComponentPropsWithoutRef<typeof Tabs> {
  storeId: Store["id"];
}

const StoreTabs: React.FC<StoreTabsProps> = ({
  className,
  storeId,
  ...props
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    {
      title: "Store",
      href: `/dashboard/stores/${storeId}`,
    },
    {
      title: "Products",
      href: `/dashboard/stores/${storeId}/products`,
    },
    {
      title: "Orders",
      href: `/dashboard/stores/${storeId}/orders`,
    },
    {
      title: "Payments",
      href: `/dashboard/stores/${storeId}/payments`,
    },
    {
      title: "Analytics",
      href: `/dashboard/stores/${storeId}/analytics`,
    },
  ];
  return (
    <Tabs
      {...props}
      className={cn("w-full overflow-x-auto overflow-y-hidden", className)}
      onValueChange={(value) => router.push(value)}
    >
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.title}
            value={tab.href}
            className={cn(
              pathname === tab.href && "bg-background text-foreground shadow-sm"
            )}
          >
            {tab.title}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default StoreTabs;
