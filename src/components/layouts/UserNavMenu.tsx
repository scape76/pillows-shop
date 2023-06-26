"use client";

import * as React from "react";
import { User } from "@clerk/nextjs/dist/types/server";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/Button";

interface UserNavMenuProps {
  user: User | null;
}

const UserNavMenu: React.FC<UserNavMenuProps> = ({ user }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user?.imageUrl} referrerPolicy="no-referrer" />
          <AvatarFallback>{`${user?.firstName?.[0]}${user?.lastName?.[0]}`}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Button
          className="w-full cursor-pointer"
            variant={"destructive"}
            onClick={() => void console.log("here")}
          >
            Logout
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserNavMenu;
