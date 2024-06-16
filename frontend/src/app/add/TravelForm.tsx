import React, { useState, useContext } from "react";
import { Context } from "../appContext";
import styles from "./add.module.css";

export default function TravelForm() {
  const { state, dispatch } = useContext(Context);
  const { travelData } = state;

  return (
    <form className={styles.addForm}>
      <div className={styles.formSection}>
        <label htmlFor="travelVehicle">Vehicle type:</label>
        <select
          id="travelVehicle"
          name="travelVehicle"
          onChange={(e) =>
            dispatch({
              type: "SET_TRAVEL_DATA",
              payload: { ...travelData, vehicle: e.target.value },
            })
          }
          defaultValue=""
        >
          <option value="" disabled>
            Select...
          </option>
          <option value="car">Car</option>
          <option value="bus">Bus</option>
          <option value="train">Train</option>
          <option value="plane">Plane</option>
        </select>
      </div>
      <div className={styles.formSection}>
        <label htmlFor="travelDistance">Travel distance (mi):</label>
        <input
          type="number"
          id="travelDistance"
          name="travelDistance"
          placeholder="Ex. 12.4"
          onChange={(e) =>
            dispatch({
              type: "SET_TRAVEL_DATA",
              payload: { ...travelData, distance: parseFloat(e.target.value) },
            })
          }
        />
      </div>
      <div className={styles.formSection}>
        <label htmlFor="travelDate">Travel Date</label>
        <div className={styles.date}>
          <select
            id="travelDay"
            name="travelDay"
            defaultValue=""
            onChange={(e) =>
              dispatch({
                type: "SET_TRAVEL_DATA",
                payload: { ...travelData, day: parseInt(e.target.value) },
              })
            }
          >
            <option value="" disabled>
              Day
            </option>
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          <select
            id="travelMonth"
            name="travelMonth"
            defaultValue=""
            onChange={(e) =>
              dispatch({
                type: "SET_TRAVEL_DATA",
                payload: { ...travelData, month: parseInt(e.target.value) },
              })
            }
          >
            <option value="" disabled>
              Month
            </option>
            {[
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
            ].map((month, index) => (
              <option key={month} value={index + 1}>
                {month}
              </option>
            ))}
          </select>
          <select
            id="travelYear"
            name="travelYear"
            defaultValue=""
            onChange={(e) =>
              dispatch({
                type: "SET_TRAVEL_DATA",
                payload: { ...travelData, year: parseInt(e.target.value) },
              })
            }
          >
            <option value="" disabled>
              Year
            </option>
            {Array.from({ length: 10 }, (_, i) => i + 2024).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
    </form>
  );
}
