import type { Metadata } from "next";

import { Shell } from "@/components/Shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import VerifyEmailForm from "@/components/forms/VerifyEmailForm";
import VerifyEmailCard from "@/components/auth/VerifyEmailCard";

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Verify your email address to continue with your sign up",
};

const page = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <VerifyEmailCard />;
    </div>
  );
};

export default page;
