import { Shell } from "@/components/Shell";
import OAuthSignIn from "@/components/auth/OAuthSignin";
import SignInCard from "@/components/auth/SignInCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import * as React from "react";

interface pageProps {}

const page: React.FC<pageProps> = ({}) => {
  return (
    <div className="justify-center h-screen flex items-center">
      <SignInCard />
    </div>
  );
};

export default page;
