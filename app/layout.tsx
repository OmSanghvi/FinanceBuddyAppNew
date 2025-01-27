import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';
import { QueryProvider } from "@/providers/query-provider";
import { SheetProvider } from "@/providers/sheet-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

/**
 * Metadata for the application.
 */
export const metadata: Metadata = {
  title: "Vorifi",
  description: "Personal Financial Manager",
};

/**
 * Root layout component for the application.
 *
 * This component sets up the global providers and layout structure for the application.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to be rendered within the layout.
 * @returns {JSX.Element} The rendered root layout component.
 */
export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <ClerkProvider>
        <html lang="en">
        <body className={inter.className}>
        <QueryProvider>
          <SheetProvider />
          <Toaster />
          {children}
        </QueryProvider>
        </body>
        </html>
      </ClerkProvider>
  );
}