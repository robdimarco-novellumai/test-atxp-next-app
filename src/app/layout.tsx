import "@/styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Test MCP Next App",
  description: "A Next.js app using App Router",
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