import * as React from "react";
import Header from "@/components/Header";
import Shell from "@/components/Shell";
import { siteConfig } from "@/config/site";
import { UserProfile, currentUser } from "@clerk/nextjs";
import { dashboardConfig } from "@/config/dashboard";
import "@/styles/clerk.css";
import { redirect } from "next/navigation";
import AddStoreForm from "@/components/forms/AddStoreForm";

export default async function page({}) {
  const user = await currentUser();

  if (!user) redirect("/signin");

  return (
    <Shell layout="dashboard">
      <Header
        title={dashboardConfig.sidebarNav.stores.new.title}
        description={dashboardConfig.sidebarNav.stores.new.description}
      />
      <AddStoreForm userId={user.id} />
    </Shell>
  );
}
