import React from "react";
import {NavSectionProvider} from "@/context/NavSection/NavSectionProvider.tsx";

export default function Layout({children}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <NavSectionProvider>{children}</NavSectionProvider>
  );
}