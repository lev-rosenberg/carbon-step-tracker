"use client";
import React, { useState, useContext } from "react";
import { Context } from "../appContext";
import TravelForm from "./TravelForm";
import UtilityForm from "./UtilityForm";
import styles from "./add.module.css";

export default function Add() {
  const [formType, setFormType] = useState<string | null>(null);
  const { state, dispatch } = useContext(Context);

  function handleSubmit(e: React.FormEvent) {
    console.log("submitting form");
    if (formType === "travel") {
      console.log("travel data", state.travelData);
      dispatch({
        type: "SET_TRAVEL_DATA",
        payload: { vehicle: "", distance: 0, day: 0, month: 0, year: 0 },
      });
    } else if (formType === "utility") {
      console.log("utility data", state.utilityData);
      dispatch({
        type: "SET_UTILITY_DATA",
        payload: {
          kWh: 0,
          startdate: { day: 0, month: 0, year: 0 },
          enddate: { day: 0, month: 0, year: 0 },
        },
      });
    }
  }

  return (
    <div className={styles.add}>
      <h1>Record your energy consumption</h1>
      <div className={styles.emissionButtons}>
        <button
          className={formType === "travel" ? styles.active : ""}
          onClick={() => setFormType("travel")}
        >
          Travel
        </button>
        <button
          className={formType === "utility" ? styles.active : ""}
          onClick={() => setFormType("utility")}
        >
          Utility
        </button>
      </div>
      {formType === "travel" && <TravelForm />}
      {formType === "utility" && <UtilityForm />}
      {formType && <button onClick={handleSubmit}>Submit</button>}
    </div>
  );
}
