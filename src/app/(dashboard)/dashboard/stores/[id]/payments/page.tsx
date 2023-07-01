import { db } from "@/db";
import { stores } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import * as React from "react";

interface pageProps {
  params: {
    id: string;
  };
}

const page: React.FC<pageProps> = async ({ params }) => {
  const storeId = Number(params.id);
  const store = await db.query.stores.findFirst({
    where: eq(stores.id, storeId),
  });

  if (!store) notFound();

  return <div>Payments of {store.id}</div>;
};

export default page;
