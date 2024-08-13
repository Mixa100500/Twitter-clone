import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import bodyS from './Layout.module.css'
import './reset.css'
const inter = Montserrat({
    subsets: ["latin"],
    weight: '400',
    style: 'normal'
});

export const metadata: Metadata = {
  title: "Twitter",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${bodyS.body}`}>{children}</body>
    </html>
  );
}
