import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import './reset.css'
import "./globals.css";
import bodyS from './Layout.module.css'

const inter = Public_Sans({
  subsets: ["latin"],
  weight: ['400', '700'],
  style: 'normal'
});

export const metadata: Metadata = {
  title: "Twitter",
  description: "Twitter clone",
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
