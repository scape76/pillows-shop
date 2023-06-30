"use client";

import * as React from "react";
import { isClerkAPIResponseError, useSignIn } from "@clerk/nextjs";
import type { OAuthStrategy } from "@clerk/types";

import { Button } from "@/components/ui/Button";
import { Icons } from "@/components/Icons";

const oauthProviders = [
  { name: "Google", strategy: "oauth_google", icon: "google" },
  { name: "Github", strategy: "oauth_github", icon: "github" },
] satisfies {
  name: string;
  icon: keyof typeof Icons;
  strategy: OAuthStrategy;
}[];

const OAuthSignIn = ({}) => {
  const [isLoading, setIsLoading] = React.useState<OAuthStrategy | null>(null);
  const { signIn, isLoaded: signInLoaded } = useSignIn();

  async function oAuthSignin(provider: OAuthStrategy) {
    if (!signInLoaded) return null;
    try {
      setIsLoading(provider);
      await signIn.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/",
      });
    } catch (e) {
      setIsLoading(null);

      const unknownError = "Something went wrong, please try again.";
      isClerkAPIResponseError(e)
        ? console.log(e.errors[0]?.longMessage ?? unknownError)
        : console.log(unknownError);
    }
  }

  return (
    <div className="grid  grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
      {oauthProviders.map((provider) => {
        const Icon = Icons[provider.icon];

        return (
          <Button
            aria-label={`Sign in with ${provider.name}`}
            key={provider.strategy}
            variant={"outline"}
            className="w-full bg-background sm:w-auto"
            onClick={() => void oAuthSignin(provider.strategy)}
          >
            {isLoading === provider.strategy ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icon className="mr-w h-4 w-4" aria-hidden="true" />
            )}
            {provider.name}
          </Button>
        );
      })}
    </div>
  );
};

export default OAuthSignIn;
