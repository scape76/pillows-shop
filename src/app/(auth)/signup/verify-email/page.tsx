import type { Metadata } from "next";

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
