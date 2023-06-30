import SiteHeader from "@/components/SiteHeader";
import { currentUser } from "@clerk/nextjs";
import * as React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      {children}
    </>
  );
};

export default Layout;
