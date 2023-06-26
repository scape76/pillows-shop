import Link from "next/link";
import * as React from "react";

interface pageProps {}

const page: React.FC<pageProps> = ({}) => {
  return (
    <div>
      <Link href={"/signin"}> Sign in </Link>
      <Link href={"/signup"}> Sign up </Link>
    </div>
  );
};

export default page;
