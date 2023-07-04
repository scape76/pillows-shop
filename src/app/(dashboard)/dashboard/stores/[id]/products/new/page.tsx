import * as React from "react";
import Header from "@/components/Header";
import Shell from "@/components/Shell";
import { currentUser } from "@clerk/nextjs";
import { dashboardConfig } from "@/config/dashboard";

import { notFound, redirect } from "next/navigation";
import AddProductForm from "@/components/forms/AddProductForm";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { stores } from "@/db/schema";

interface pageProps {
  params: {
    id: string
  }
}

export default async function page({params}: pageProps) {
  const user = await currentUser();

  if (!user) redirect("/signin");

  const storeId = Number(params.id);

  const store = await db.query.stores.findFirst({
    where: eq(stores.id, storeId)
  })

  if (!store) notFound();

  return (
    <Shell layout="dashboard">
      <Header
        title={"New Product"}
        description={`New product for your ${store?.name}`}
      />
      <AddProductForm userId={user.id} storeId={store.id} storeName={store.name}/>
    </Shell>
  );
}
