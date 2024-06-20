"use client";
import React, { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { Context } from "../appContext";
import styles from "./login.module.css";
import axios from "axios";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [signup, setSignup] = useState(false); //
  const { dispatch } = useContext(Context);
  const router = useRouter();

  async function handleLogin() {
    if (!username || !password) {
      setError("Please enter a username and password.");
      return;
    }
    const url = process.env.NEXT_PUBLIC_BASE_URL + "/auth";
    const data = { username: username, password: password, duration: 720 };
    try {
      const result = await axios.post(url, data);
      if (result.status === 200) {
        setError("");
        localStorage.setItem("carbon-auth-token", result.data);
        router.push("/home");
        dispatch({ type: "SET_LOGGED_IN", payload: true });
      } else {
        setError("Login failed. Please check credentials and try again.");
      }
    } catch (error) {
      setError("Login failed. Please check credentials and try again.");
    }
  }

  async function handleSignup() {
    if (!username || !password) {
      setError("Please enter a username and password.");
      return;
    }
    const url = process.env.NEXT_PUBLIC_BASE_URL + "/signup";
    const data = { username: username, password: password };
    try {
      const result = await axios.post(url, data);
      if (result.status === 200) {
        setError("");
        setSignup(true);
      }
    } catch (error) {
      setError("Signup failed. Please try again.");
      setSignup(false);
    }
  }

  return (
    <div className={styles.login}>
      <h1>Carbon Footprint Tracker</h1>
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
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

        <button onClick={handleLogin}>Login</button>
        <button className={styles.signup} onClick={handleSignup}>
          Signup
        </button>
      </form>

      <div>
        {signup && (
          <p className={styles.signupSuccess}>
            Signup successful. Please login with your new credentials.
          </p>
        )}
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
}
