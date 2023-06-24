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
  return <SignInCard />;
};

export default page;
