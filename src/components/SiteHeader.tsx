import { currentUser } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/dist/types/server";
import * as React from "react";
import MainNav from "@/components/layouts/MainNav";
import { siteConfig } from "@/config/site";
import Link from "next/link";
import { Button } from "./ui/Button";
import UserNavMenu from "./layouts/UserNavMenu";

interface SiteHeaderProps {
  user: User | null;
}

const SiteHeader = ({ user }: SiteHeaderProps) => {
  console.log(user);

  return (
    <header className="sticky top-0 z-40 flex items-center justify-center border-b bg-background/20 p-4">
      <div className="flex w-full max-w-6xl items-center justify-between">
        <div className="flex items-center gap-4">
          <MainNav items={siteConfig.mainNav} />
        </div>
        {!!user ? (
          <UserNavMenu user={user} />
        ) : (
          <Link href="/signin">
            <Button variant={"ghost"}>Sign in</Button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default SiteHeader;
