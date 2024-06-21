"use client";
import React, { useState, useContext } from "react";
import { Context } from "../appContext";
import TravelForm from "./TravelForm";
import UtilityForm from "./UtilityForm";
import Loading from "../components/Loading";
import axios from "axios";
import styles from "./add.module.css";

export default function Add() {
  const [formType, setFormType] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(0);
  const [error, setError] = useState(false);
  const { state, dispatch } = useContext(Context);
  const { travelData, utilityData } = state;

  function dateToString(date: { day: number; month: number; year: number }) {
    return `${date.year}-${date.month < 10 ? "0" : ""}${date.month}-${
      date.day < 10 ? "0" : ""
    }${date.day}`;
  }

  function isDateValid(date: { day: number; month: number; year: number }) {
    return date.day > 0 && date.day < 32 && date.month > 0 && date.month < 13;
  }

  function validateTravelData(data: {
    vehicle: string;
    distance: number;
    day: number;
    month: number;
    year: number;
  }) {
    if (data.vehicle === "" || data.distance === 0 || !isDateValid(data)) {
      setError(true);
      return false;
    }
    return true;
  }

  function validateUtilityData(data: {
    kWh: number;
    startdate: { day: number; month: number; year: number };
    enddate: { day: number; month: number; year: number };
  }) {
    if (
      data.kWh === 0 ||
      !isDateValid(data.startdate) ||
      !isDateValid(data.enddate)
    ) {
      setError(true);
      return false;
    }
    return true;
  }

  async function submitTravelData() {
    const token = localStorage.getItem("carbon-auth-token");
    if (!validateTravelData(travelData)) {
      return;
    }
    setError(false);
    setLoading(true);
    const formattedDate = dateToString({ ...travelData });
    const req_headers = { Authorization: token };
    const url = process.env.NEXT_PUBLIC_BASE_URL + "/travel";
    const data = {
      distance: travelData.distance,
      vehicle_type: travelData.vehicle,
      traveldate: formattedDate,
    };
    try {
      const request = await axios.post(url, data, { headers: req_headers });
      setResult(request.data);
      dispatch({
        type: "SET_TRAVEL_DATA",
        payload: { vehicle: "", distance: 0, day: 0, month: 0, year: 0 },
      });
    } catch (error) {
      console.error("Error submitting travel data", error);
      setError(true);
    }
    setLoading(false);
  }

  async function submitUtilityData() {
    const token = localStorage.getItem("carbon-auth-token");
    if (!validateUtilityData(utilityData)) {
      return;
    }
    setError(false);
    setLoading(true);
    const formattedStartDate = dateToString(utilityData.startdate);
    const formattedEndDate = dateToString(utilityData.enddate);
    const req_headers = { Authorization: token };
    const url = process.env.NEXT_PUBLIC_BASE_URL + "/home";
    const data = {
      kWh: utilityData.kWh,
      state: utilityData.state,
      startdate: formattedStartDate,
      enddate: formattedEndDate,
    };
    try {
      const request = await axios.post(url, data, { headers: req_headers });
      setResult(request.data);
      dispatch({
        type: "SET_UTILITY_DATA",
        payload: {
          kWh: 0,
          startdate: { day: 0, month: 0, year: 0 },
          enddate: { day: 0, month: 0, year: 0 },
        },
      });
    } catch (error) {
      console.error("Error submitting utility data", error);
      setError(true);
    }
    setLoading(false);
  }

  async function handleSubmitData(e: React.FormEvent) {
    console.log("submitting form");
    if (formType === "travel") {
      submitTravelData();
    } else if (formType === "utility") {
      submitUtilityData();
    }
  }

  function handleResetForm() {
    setResult(0);
    setFormType(null);
  }

  return (
    <div className={styles.add}>
      {loading ? <Loading /> : null}
      {result ? (
        <div className="flex flex-col">
          <h1>Your {formType} energy use emmitted</h1>
          <h1>{result} kg co2e</h1>
          <button className="mt-8 self-center" onClick={handleResetForm}>
            Record another
          </button>
        </div>
      ) : (
        <>
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
          {formType && <button onClick={handleSubmitData}>Submit</button>}
          <div className={styles.error}>
            {error && (
              <p>Calculation failed. Please check your data and try again.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
