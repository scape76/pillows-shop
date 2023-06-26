import * as React from "react";
import CloseModal from "@/components/CloseModal";

interface pageProps {
  children: React.ReactNode;
}

const page: React.FC<pageProps> = ({ children }) => {
  return (
    <div className="bg-accent/2 fixed inset-0 z-10">
      <div className="container mx-auto flex h-full max-w-lg items-center">
        <div className="relative h-fit w-full rounded-lg bg-background px-2 py-2">
          <div className="absolute right-12 top-12 z-10">
            <CloseModal />
          </div>
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default page;
