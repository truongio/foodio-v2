import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Recipes",
  description: "A minimal recipe collection",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
