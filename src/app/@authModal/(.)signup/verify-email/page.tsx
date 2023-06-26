import type { Metadata } from "next";

import VerifyEmailCard from "@/components/auth/VerifyEmailCard";
import ModalShell from "@/components/ModalShell";
// import { VerifyEmailForm } from "@/components/forms/verify-email-form";

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Verify your email address to continue with your sign up",
};

export default function VerifyEmailPage() {
  return (
    <ModalShell>
      <VerifyEmailCard />
    </ModalShell>
  );
}
