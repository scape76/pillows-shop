import Shell from "@/components/Shell";
import OAuthSignIn from "@/components/auth/OAuthSignin";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import * as React from "react";
import SignInForm from "../forms/SignInForm";
import Link from "next/link";


const SignInCard = ({}) => {
  return (
    <Shell layout="auth">
      <Card>
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>
            Choose your preferred sign in method
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <OAuthSignIn />
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <SignInForm />
        </CardContent>
        <CardFooter className="flex flex-wrap items-center space-x-2">
          <div className="fkex01 text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              aria-label="Sign up"
              href="/signup"
              className="text-primary underline-offset-4 transition-colors hover:underline"
            >
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </Shell>
  );
};

export default SignInCard;
