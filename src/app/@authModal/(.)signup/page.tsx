import CloseModal from "@/components/CloseModal";
import ModalShell from "@/components/ModalShell";
import SignUpCard from "@/components/auth/SignUpCard";
import * as React from "react";

interface pageProps {}

const page: React.FC<pageProps> = ({}) => {
  return (
    <ModalShell>
      <SignUpCard />
    </ModalShell>
  );
};

export default page;
