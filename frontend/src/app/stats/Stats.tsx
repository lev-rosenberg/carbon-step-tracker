"use client";
import React, { useState, useEffect } from "react";
import StatsChart from "./StatsChart";
import axios from "axios";
import styles from "./stats.module.css";
import { on } from "events";

export default function Stats() {
  interface DictData {
    [key: string]: {
      travel_footprint: number;
      utility_footprint: number;
    };
  }

  interface ListData {
    date: string;
    travel_footprint: number;
    utility_footprint: number;
  }

  const [data, setData] = useState<ListData[]>([]);
  const [month, setMonth] = useState(new Date().getMonth());
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    async function handleGraph() {
      const firstDayOfMonth = new Date(new Date().getFullYear(), month, 1)
        .toISOString()
        .split("T")[0];
      let lastDayOfMonth;
      const currMonth = new Date().getMonth();
      if (currMonth === month) {
        lastDayOfMonth = new Date().toISOString().split("T")[0];
      } else {
        lastDayOfMonth = new Date(new Date().getFullYear(), month + 1, 0)
          .toISOString()
          .split("T")[0];
      }

      const url = process.env.NEXT_PUBLIC_BASE_URL + "/graph";
      const token = localStorage.getItem("carbon-auth-token");
      const queryParams = {
        startdate: firstDayOfMonth,
        enddate: lastDayOfMonth,
      };
      const config = {
        headers: { Authorization: token },
        params: queryParams,
      };
      try {
        console.log("here");
        const res = await axios.get(url, config);
        const body = res.data;
        const combined_data: DictData = body.combined_data;
        const list_combined_data = Object.entries(combined_data).map(
          ([date, data]) => ({
            date,
            travel_footprint: data.travel_footprint,
            utility_footprint: data.utility_footprint,
          })
        );
        setData(list_combined_data);
      } catch (error) {
        console.error("Error loading bar graph", error);
      }
    }
    handleGraph();
  }, [month]);
  return (
    <div className={styles.stats}>
      <h1>Your Carbon Stats</h1>
      <p>For the month of</p>
      <select
        value={month}
        onChange={(e) => setMonth(parseInt(e.target.value))}
      >
        {months.map((month, idx) => (
          <option key={month} value={idx}>
            {month}
          </option>
        ))}
      </select>
      <div className={styles.chart}>
        <StatsChart data={data} />
      </div>
    </div>
  );
}
