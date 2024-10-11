import type { Metadata } from "next";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "sphera world",
  description: "Sphera Summer Season",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} style={{margin:"0%",padding:"0%",boxSizing:"border-box"}}>{children}</body>
  
    </html>
  );
}
