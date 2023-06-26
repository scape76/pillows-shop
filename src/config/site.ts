import { slugify } from "@/lib/utils";
import { productCategories } from "./products";

export const siteConfig = {
  name: "Pillows shop",
  description: "An open source e-commerce website built using Next.js",
  url: "",
  mainNav: [
    {
      title: "Lobby",
      items: [
        {
          title: "Products",
          href: "/products",
          description: "Discover all the products we have to offer",
          items: [],
        },
        {
          title: "Blog",
          href: "/blog",
          description: "Read our latest blog posts.",
          items: [],
        },
      ],
    },
    ...productCategories.map((category) => ({
      title: category.title,
      items: [
        {
          title: "All",
          href: `/categories/${slugify(category.title)}`,
          description: `All ${category.title}`,
          items: [],
        },
        ...category.subcategories.map((subcategory) => ({
          title: subcategory.title,
          href: `/categories/${slugify(category.title)}/${subcategory.slug}`,
          description: subcategory.description,
          items: [],
        })),
      ],
    })),
  ],
};
