import * as React from "react";
import Header from "@/components/Header";
import Shell from "@/components/Shell";
import { siteConfig } from "@/config/site";
import { UserProfile } from "@clerk/nextjs";
import { dashboardConfig } from "@/config/dashboard";
import "@/styles/clerk.css";


const page = ({}) => {
  return (
    <Shell layout="dashboard">
      <Header
        title={dashboardConfig.sidebarNav.account.title}
        description={dashboardConfig.sidebarNav.account.description}
      />
      <div className="w-full">
        <UserProfile
          appearance={{
            variables: {
              borderRadius: "0.25rem",
            },
            elements: {
              card: "shadow-none",
              navbar: "hidden",
              navbarMobileMenuButton: "hidden",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              pageScrollBox: "p-0",
            },
          }}
        />
      </div>
    </Shell>
  );
};

export default page;
