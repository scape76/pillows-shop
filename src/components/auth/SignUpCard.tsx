import { Shell } from "@/components/Shell";
import OAuthSignin from "@/components/auth/OAuthSignin";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import * as React from "react";
import SignUpForm from "../forms/SignUpForm";
import Link from "next/link";

interface SignUpCardProps {}

const SignUpCard: React.FC<SignUpCardProps> = ({}) => {
  return (
    <Shell layout="auth">
      <Card>
        <CardHeader>
          <CardTitle>Sign up</CardTitle>
          <CardDescription>
            Choose your preferred sign up method
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <OAuthSignin />
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
          <SignUpForm />
        </CardContent>
        <CardFooter className="flex flex-wrap items-center space-x-2">
          <div className="fkex01 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              aria-label="Sign in"
              href="/signin"
              className="text-primary underline-offset-4 transition-colors hover:underline"
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </Shell>
  );
};

export default SignUpCard;
