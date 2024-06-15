"use client";
import React, { useState, useEffect } from "react";
import PiChart from "./PiChart";
import axios from "axios";
import styles from "./home.module.css";

export default function Home() {
  const [utilityEmissions, setUtilityEmissions] = useState(0);
  const [travelEmissions, setTravelEmissions] = useState(0);
  const data01 = [
    { name: "Utility Emissions", value: utilityEmissions },
    { name: "Travel Emissions", value: travelEmissions },
  ];
  const currentMonth = new Date().toLocaleString("default", { month: "long" });
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    async function handleGraph() {
      const firstDayYear = new Date(new Date().getFullYear(), 0, 1)
        .toISOString()
        .split("T")[0];
      const today = new Date().toISOString().split("T")[0];

      const url = process.env.NEXT_PUBLIC_BASE_URL + "/graph";
      const token = localStorage.getItem("carbon-auth-token");
      const queryParams = { startdate: firstDayYear, enddate: today };
      const config = {
        headers: { Authorization: token },
        params: queryParams,
      };
      try {
        const res = await axios.get(url, config);
        const body = res.data;
        const travel_sum = body["travel_sum"];
        const utility_sum = body["utility_sum"];
        setTravelEmissions(travel_sum);
        setUtilityEmissions(utility_sum);
      } catch (error) {
        console.error("Error loading pi graph", error);
      }
    }
    handleGraph();
  }, []);

  // res = requests.get(url, (params = params));

  return (
    <div className={styles.home}>
      <h1>Your Carbon Footprint</h1>
      <p>For {currentYear}</p>
      <div className={styles.chart}>
        <PiChart data={data01} />
      </div>
    </div>
  );
}
