"use client";
import React, { useContext, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import { Context } from "../appContext";
import Footer from "./footer/Footer";

export default function LoginControl({
  children,
}: {
  children: React.ReactNode;
}) {
  const { dispatch, state } = useContext(Context);
  const { loggedIn } = state;
  const pathname = usePathname();
  const router = useRouter();
  const token = localStorage.getItem("carbon-auth-token");

  useEffect(() => {
    const token = localStorage.getItem("carbon-auth-token");
    async function checkAuthToken() {
      if (token) {
        const url = process.env.NEXT_PUBLIC_BASE_URL + "/auth";
        const data = { token: token };
        try {
          const result = await axios.post(url, data);
          if (result.data === "valid token") {
            if (pathname === "/login") {
              router.push("/home");
            }
            dispatch({ type: "SET_LOGGED_IN", payload: true });
          } else {
            if (pathname !== "/login") {
              logout();
            }
          }
        } catch (error) {
          console.error("Error checking token", error);
          if (pathname !== "/login") {
            logout();
          }
        }
      } else {
        if (pathname !== "/login") {
          logout();
        }
      }
    }
    checkAuthToken();
  }, []);

  function logout() {
    localStorage.removeItem("carbon-auth-token");
    dispatch({ type: "SET_LOGGED_IN", payload: false });
    router.push("/login");
  }

  return (
    <div className="app">
      {token && (
        <button className="text-xs self-end m-1" onClick={logout}>
          Logout
        </button>
      )}
      {children}
      {token && <Footer />}
    </div>
  );
}
