import type { Store } from "@/db/schema";
import * as React from "react";

interface pageProps {
  params: {
    id: Store["id"];
  };
}

const page: React.FC<pageProps> = ({params}) => {
  return <div>{params.id} store page</div>;
};

export default page;
