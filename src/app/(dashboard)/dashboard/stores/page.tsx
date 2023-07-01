import * as React from "react";
import { siteConfig } from "@/config/site";
import { UserProfile, currentUser } from "@clerk/nextjs";
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
import { db } from "@/db";
import { asc, desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

const page = async ({}) => {
  const user = await currentUser();

  if (!user) redirect("/signin");

  const userStores = await db.query.stores.findMany({
    where: eq(stores.userId, user.id),
    with: {
      products: {
        columns: {
          id: true,
        },
      },
    },
  });

  return (
    <Shell layout="dashboard">
      <Header
        title={dashboardConfig.sidebarNav.stores.title}
        description={dashboardConfig.sidebarNav.stores.description}
      />
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {userStores.map((store) => (
          <Card className="flex h-full flex-col">
            <CardHeader className="flex-1">
              <CardTitle className="line-clamp-1">{store.name}</CardTitle>
              <CardDescription className="line-clamp-2">
                {store.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={`/dashboard/stores/${store.id}`}>
                <div
                  className={cn(
                    buttonVariants({ size: "sm", className: "h-8 w-full" })
                  )}
                >
                  View store
                  <span className="sr-only">View {store.name} store</span>
                </div>
              </Link>
            </CardContent>
          </Card>
        ))}
        <Card className="flex h-full flex-col bg-accent">
          <CardHeader className="flex-1">
            <CardTitle className="line-clamp-1 text-accent-foreground">
              Create a new store
            </CardTitle>
            <CardDescription className="line-clamp-2 text-accent-foreground">
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
