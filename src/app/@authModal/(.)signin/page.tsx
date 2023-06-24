import CloseModal from "@/components/CloseModal";
import SignInCard from "@/components/auth/SignInCard";
import * as React from "react";

interface pageProps {}

const page: React.FC<pageProps> = ({}) => {
  return (
    <div className="bg-accent/2 fixed inset-0 z-10">
      <div className="container mx-auto flex h-full max-w-lg items-center">
        <div className="relative h-fit w-full rounded-lg bg-background px-2 py-2">
          <div className="absolute right-12 top-12 z-10">
            <CloseModal />
          </div>
          <div className="relative">
            <SignInCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
