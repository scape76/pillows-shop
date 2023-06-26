import CloseModal from "@/components/CloseModal";
import ModalShell from "@/components/ModalShell";
import SignInCard from "@/components/auth/SignInCard";
import * as React from "react";

interface pageProps {}

const page: React.FC<pageProps> = ({}) => {
  return (
    <ModalShell>
      <SignInCard />
    </ModalShell>
  );
};

export default page;
