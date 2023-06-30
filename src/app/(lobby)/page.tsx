import Link from "next/link";
import * as React from "react";


const page = ({}) => {
  return (
    <div>
      <Link href={"/signin"}> Sign in </Link>
      <Link href={"/signup"}> Sign up </Link>
    </div>
  );
};

export default page;
