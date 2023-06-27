import { Icons } from "@/components/Icons";

export const dashboardConfig = {
  sidebarNav: {
    account: {
      title: "Account",
      href: "/dashboard/account",
      Icon: Icons.user,
      description: "Manage your account settings.",
    },
    stores: {
      title: "Stores",
      href: "/dashboard/stores",
      Icon: Icons.store,
      description: "Manage your stores.",
      new: {
        title: "New Store",
        description: "New store for yor account.",
      },
    },
  },
};
