// TODO : fulfill me
type Product = { category: "pillows" };

export const sortOptions = [];

export const productCategories: {
  title: Product["category"];
  subcategories: {
    title: string;
    description?: string;
    image?: string;
    slug: string;
  }[];
}[] = [
  {
    title: "pillows",
    subcategories: [
      {
        title: "Bed pillows",
        description: "Designed to support the head and neck while sleeping",
        slug: "Bed-pillows",
      },
      {
        title: "Body Pillows",
        description: "Designed to provide support to the entire body",
        slug: "Body-pillows",
      },
    ],
  },
];
