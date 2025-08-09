import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Story Mint",
  description: "Turn memories into NFTs on Polygon"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
