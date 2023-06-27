import type { Icon } from "@/components/Icons";
import Link from "next/link";
import * as React from "react";

interface AsideItemProps {
  Icon: Icon;
  href: string;
  title: string;
}
const AsideItem: React.FC<AsideItemProps> = ({ Icon, href, title }) => {
  return (
    <Link href={href}>
      <div className="flex cursor-pointer items-center gap-x-2 rounded p-2 text-sm hover:bg-accent">
        <Icon className="h-4 w-4" />
        <span className="text-md font-semibold">{title}</span>
      </div>
    </Link>
  );
};

export default AsideItem;
