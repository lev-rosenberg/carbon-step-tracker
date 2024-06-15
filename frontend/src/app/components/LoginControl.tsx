"use client";
import React, { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
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
    <div className="app">
      {token && (
        <button className="text-xs self-end p-2" onClick={logout}>
          Logout
        </button>
      )}
      {children}
      {token && <Footer />}
    </div>
  );
}
