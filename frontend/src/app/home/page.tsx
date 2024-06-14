"use client";
import React, { useContext } from "react";
import PiChart from "./PiChart";
import styles from "./home.module.css";
export default function Home() {
  const data01 = [
    { name: "Group A", value: 400 },
    { name: "Group B", value: 300 },
    { name: "Group C", value: 300 },
    { name: "Group D", value: 200 },
    { name: "Group E", value: 278 },
    { name: "Group F", value: 189 },
  ];

  return (
    <div className={styles.home}>
      <h1>Home</h1>
      <div className={styles.chart}>
        <PiChart data={data01} />
      </div>
    </div>
  );
}
