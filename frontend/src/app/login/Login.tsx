"use client";
import React, { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { Context } from "../appContext";
import styles from "./login.module.css";
import axios from "axios";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const { state, dispatch } = useContext(Context);
  const url = process.env.NEXT_PUBLIC_BASE_URL + "/auth";
  const router = useRouter();

  async function handleLogin() {
    const data = { username: username, password: password, duration: 30 };
    try {
      const result = await axios.post(url, data);
      setError(false);
      localStorage.setItem("carbon-auth-token", result.data);
      dispatch({ type: "SET_LOGGED_IN", payload: true });
    } catch (error) {
      setError(true);
      console.error("Error logging in", error);
    }
  }
  return (
    <div className={styles.login}>
      <h1>Carbon Footprint Tracker</h1>
      <input
        type="text"
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className={styles.error}>
        {error && <p>Login failed. Please check credentials and try again.</p>}
      </div>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
