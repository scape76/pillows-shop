import ProductsTable from "@/components/ProductsTable";
import { db } from "@/db";
import { Product, products, stores } from "@/db/schema";
import { eq, gte, like, lte, and, desc, asc, sql } from "drizzle-orm";
import { notFound } from "next/navigation";
import * as React from "react";

interface pageProps {
  params: {
    id: string;
  };
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const page: React.FC<pageProps> = async ({ params, searchParams }) => {
  const storeId = Number(params.id);

  const { page, per_page, sort, name, date_range } = searchParams;

  const store = await db.query.stores.findFirst({
    where: eq(stores.id, storeId),
    columns: {
      id: true,
      name: true,
    },
  });

  if (!store) notFound();

  // Number of products to show per page
  const limit = typeof per_page === "string" ? parseInt(per_page) : 10;
  // Number of products to skip
  const offset = typeof page === "string" ? (parseInt(page) - 1) * limit : 0;

  // Column and order to sort by
  const [column, order] =
    typeof sort === "string"
      ? (sort.split(".") as [
          keyof Product | undefined,
          "asc" | "desc" | undefined
        ])
      : [];

  // Date range for created date

  const [start_date, end_date] =
    typeof date_range === "string" ? date_range.split("to") : [];

  // Use db transaction so both queries become single logical unit

  const { storeProducts, totalProducts } = await db.transaction(async (tx) => {
    const storeProducts = await tx
      .select()
      .from(products)
      .limit(limit)
      .offset(offset)
      .where(
        and(
          eq(products.storeId, storeId),
          // Filter by name
          typeof name === "string"
            ? like(products.name, `%${name}%`)
            : undefined,
          // Filter by creation date
          start_date ? gte(products.createdAt, start_date) : undefined,
          end_date ? lte(products.createdAt, end_date) : undefined
        )
      )
      .orderBy(
        column && column in products
          ? order === "asc"
            ? asc(products[column])
            : desc(products[column])
          : desc(products.createdAt)
      );

    const totalProducts = await tx
      .select({
        count: sql<number>`count(${products.id})`,
      })
      .from(products)
      .where(
        and(
          eq(products.storeId, storeId),
          typeof name === "string"
            ? like(products.name, `%${name}%`)
            : undefined,
          start_date && end_date
            ? and(
                gte(products.createdAt, start_date),
                lte(products.createdAt, end_date)
              )
            : undefined
        )
      );

    return {
      storeProducts,
      totalProducts: Number(totalProducts[0]?.count) ?? 0,
    };
  });

  const pageCount = Math.ceil(totalProducts / limit);

  return (
    <ProductsTable
      data={storeProducts}
      pageCount={pageCount}
      storeId={storeId}
    />
  );
};

export default page;
