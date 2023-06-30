import Header from "@/components/Header";
import Shell from "@/components/Shell";
import StoreNavigator from "@/components/StoreNavigator";
import StoreTabs from "@/components/StoreTabs";
import { db } from "@/db";
import { stores } from "@/db/schema";
import { currentUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import * as React from "react";

interface LayoutProps {
  children: React.ReactNode;
  params: {
    id: string;
  };
}

const Layout: React.FC<LayoutProps> = async ({ children, params }) => {
  const storeId = Number(params.id);

  const user = await currentUser();

  if (!user) redirect("/signin");

  const store = await db.query.stores.findFirst({
    where: eq(stores.id, storeId),
    columns: {
      id: true,
      name: true,
    },
  });

  if (!store) {
    notFound();
  }

  return (
    <Shell>
      <div className="scape-x-4 flex items-center">
        <Header title={store.name} size="sm" className="flex-1" />
        <StoreNavigator storeId={storeId} userId={user.id} />
      </div>
      <div className="space-y-4 overflow-hidden">
        <StoreTabs storeId={storeId} />
        {children}
      </div>
    </Shell>
  );
};

export default Layout;
