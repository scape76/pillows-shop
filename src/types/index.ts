import { type Icons } from "@/components/Icons";
import { type FileWithPath } from "react-dropzone";

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export type StoredFile = {
  id: string;
  name: string;
  url: string;
};

export type MainNavItem = NavItemWithOptionalChildren;

export type FileWithPreview = FileWithPath & {
  preview: string;
};
