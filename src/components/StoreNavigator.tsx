"use client";

import { Store } from "@/db/schema";
import { User } from "@clerk/nextjs/dist/types/server";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Button } from "./ui/Button";
import { Icons } from "./Icons";
import { getNextStoreIdAction, getPreviousStoreIdAction } from "@/app/_actions/store";
import { toast } from "./ui/useToast";

interface StoreNavigatorProps {
  storeId: Store["id"];
  userId: User["id"];
}

const StoreNavigator: React.FC<StoreNavigatorProps> = ({ storeId, userId }) => {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  return (
    <div className="flex space-x-0.5 pr-1">
      <Button
        variant={"ghost"}
        size={"icon"}
        onClick={() => {
          startTransition(async () => {
            try {
              const prevStoreId = await getPreviousStoreIdAction({
                id: storeId,
                userId,
              });

              router.push(`/dashboard/stores/${prevStoreId}`);
            } catch (e) {
              e instanceof Error
                ? toast({
                    title: "Error",
                    description: e.message,
                    variant: "destructive",
                  })
                : toast({
                    title: "Error",
                    description: "Something went wrong, please try again.",
                    variant: "destructive",
                  });
            }
          });
        }}
        disabled={isPending}
      >
        <Icons.chevronLeft />
        <span className="sr-only">Previous store</span>
      </Button>
      <Button
        variant={"ghost"}
        size={"icon"}
        onClick={() => {
          startTransition(async () => {
            try {
              const nextStoreId = await getNextStoreIdAction({
                id: storeId,
                userId,
              });

              router.push(`/dashboard/stores/${nextStoreId}`);
            } catch (e) {
              e instanceof Error
                ? toast({
                    title: "Error",
                    description: e.message,
                    variant: "destructive",
                  })
                : toast({
                    title: "Error",
                    description: "Something went wrong, please try again.",
                    variant: "destructive",
                  });
            }
          });
        }}
        disabled={isPending}
      >
        <Icons.chevronRight />
        <span className="sr-only">Next store</span>
      </Button>
    </div>
  );
};

export default StoreNavigator;
