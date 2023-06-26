import { relations, sql, type InferModel } from "drizzle-orm";
import {
  serial,
  mysqlTable,
  varchar,
  decimal,
  text,
  int,
  datetime,
} from "drizzle-orm/mysql-core";

export const stores = mysqlTable("stores", {
  id: serial("id").primaryKey(),
  userId: varchar("userId", { length: 191 }).notNull(),
  name: varchar("userId", { length: 191 }).notNull(),
  description: text("description"),
  slug: text("slug"),
  createdAt: datetime("createdAt", { mode: "string", fsp: 3 })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP(3)`),
});

export const products = mysqlTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 191 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }),
  storeId: int("storeId").notNull(),
});

export const productsRelations = relations(products, ({ one }) => ({
  store: one(stores, {
    fields: [products.storeId],
    references: [stores.id],
  }),
}));
