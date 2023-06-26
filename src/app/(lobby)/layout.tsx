import SiteHeader from "@/components/SiteHeader";
import { currentUser } from "@clerk/nextjs";
import * as React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = async ({ children }) => {
  const user = await currentUser();

  return (
    <>
      {" "}
      <SiteHeader user={user} />
      {children}
    </>
  );
};

export default Layout;
