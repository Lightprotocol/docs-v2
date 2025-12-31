import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Light Protocol Code Runner",
  description: "Interactive code examples for Light Protocol",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}

