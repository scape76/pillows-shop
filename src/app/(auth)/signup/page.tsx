import * as React from "react";
import SignUpCard from "@/components/auth/SignUpCard";

interface pageProps {}

const page: React.FC<pageProps> = ({}) => {
  return (
    <div className="flex h-screen items-center justify-center">
      <SignUpCard />
    </div>
  );
};

export default page;
