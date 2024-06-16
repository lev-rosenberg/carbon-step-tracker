"use client";
import React, { use, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Inter } from "next/font/google";
import LoginControl from "./components/LoginControl";
import { Context, ContextProvider } from "./appContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <ContextProvider>
          <LoginControl>{children}</LoginControl>
        </ContextProvider>
      </body>
    </html>
  );
}
