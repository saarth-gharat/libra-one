import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import ThemeInitializer from "@/components/theme/ThemeInitializer";

export const metadata: Metadata = {
  title: "LIBRA.ONE",
  description: "Modern Library Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeInitializer />
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}