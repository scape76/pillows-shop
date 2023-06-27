import * as React from "react";
import Header from "@/components/Header";
import Shell from "@/components/Shell";
import { siteConfig } from "@/config/site";
import { UserProfile } from "@clerk/nextjs";
import { dashboardConfig } from "@/config/dashboard";
import "@/styles/clerk.css";

interface pageProps {}

const page: React.FC<pageProps> = ({}) => {
  return (
    <Shell layout="dashboard">
      <Header
        title={dashboardConfig.sidebarNav.stores.new.title}
        description={dashboardConfig.sidebarNav.stores.new.description}
      />
      <div className="w-full"></div>
    </Shell>
  );
};

export default page;
