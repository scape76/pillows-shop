import * as React from "react";
import { siteConfig } from "@/config/site";
import { UserProfile } from "@clerk/nextjs";
import { dashboardConfig } from "@/config/dashboard";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import Header from "@/components/Header";
import Shell from "@/components/Shell";

import "@/styles/clerk.css";
import { stores } from "@/db/schema";
import Link from "next/link";
import { P } from "drizzle-orm/select.types.d-1d455120";

interface pageProps {}

const page: React.FC<pageProps> = ({}) => {
  return (
    <Shell layout="dashboard">
      <Header
        title={dashboardConfig.sidebarNav.stores.title}
        description={dashboardConfig.sidebarNav.stores.description}
      />
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        <Card className="flex h-full flex-col">
          <CardHeader className="flex-1">
            <CardTitle className="line-clamp-1">Create a new store</CardTitle>
            <CardDescription className="line-clamp-2">
              Create a new store to start selling your products.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href={"/dashboard/stores/new"}>
              <div
                className={cn(
                  buttonVariants({ size: "sm", className: "h-8 w-full" })
                )}
              >
                Create a store
                <span className="sr-only">Create a store</span>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
};

export default page;
