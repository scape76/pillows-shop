import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { ClerkProvider, currentUser } from "@clerk/nextjs";
import SiteHeader from "@/components/SiteHeader";
import { Toaster } from "@/components/ui/Toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Pillows shop",
  description: "Main page",
};

export default async function RootLayout({
  children,
  authModal,
}: {
  children: React.ReactNode;
  authModal: React.ReactNode;
}) {
  const user = await currentUser();

  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <SiteHeader user={user} />
          {children}
          {authModal}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
