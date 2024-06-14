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
  const { dispatch, state } = useContext(Context);
  const { loggedIn } = state;
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("carbon-auth-token");
    async function checkAuthToken() {
      if (token) {
        const url = process.env.NEXT_PUBLIC_BASE_URL + "/auth";
        const data = { token: token };
        try {
          const result = await axios.post(url, data);
          if (result.data === "valid token") {
            console.log("valid token");
            router.push("/home");
            dispatch({ type: "SET_LOGGED_IN", payload: true });
          }
        } catch (error) {
          console.error("Error checking token", error);
          router.push("/login");
          dispatch({ type: "SET_LOGGED_IN", payload: false });
        }
      } else {
        console.log("no token");
        router.push("/login");
        dispatch({ type: "SET_LOGGED_IN", payload: false });
      }
    }
    checkAuthToken();
  }, [router, dispatch, loggedIn]);

  function logout() {
    localStorage.removeItem("carbon-auth-token");
    dispatch({ type: "SET_LOGGED_IN", payload: false });
    router.push("/login");
  }

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
