import React, { useState, useContext } from "react";
import { Context } from "../appContext";
import styles from "./add.module.css";

export default function UtilityForm() {
  const { state, dispatch } = useContext(Context);
  const { utilityData } = state;

  return (
    <form className={styles.addForm}>
      <div className={styles.formSection}>
        <label htmlFor="kWh">Amount of kWh:</label>
        <input
          type="number"
          id="kWh"
          name="kWh"
          placeholder="Ex. 32.5"
          onChange={(e) =>
            dispatch({
              type: "SET_UTILITY_DATA",
              payload: { ...utilityData, kWh: parseFloat(e.target.value) },
            })
          }
        />
      </div>
      <div className={styles.formSection}>
        <label htmlFor="billStartDate">Bill Start Date</label>
        <div className={styles.date}>
          <select
            id="billStartDay"
            name="billStartDay"
            defaultValue=""
            onChange={(e) =>
              dispatch({
                type: "SET_UTILITY_DATA",
                payload: {
                  ...utilityData,
                  startdate: {
                    ...utilityData.startdate,
                    day: parseInt(e.target.value),
                  },
                },
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
            id="billStartMonth"
            name="billStartMonth"
            defaultValue=""
            onChange={(e) =>
              dispatch({
                type: "SET_UTILITY_DATA",
                payload: {
                  ...utilityData,
                  startdate: {
                    ...utilityData.startdate,
                    month: parseInt(e.target.value),
                  },
                },
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
            id="billStartYear"
            name="billStartYear"
            defaultValue=""
            onChange={(e) =>
              dispatch({
                type: "SET_UTILITY_DATA",
                payload: {
                  ...utilityData,
                  startdate: {
                    ...utilityData.startdate,
                    year: parseInt(e.target.value),
                  },
                },
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
      <div className={styles.formSection}>
        <label htmlFor="billEndDate">Bill End Date</label>
        <div className={styles.date}>
          <select
            id="billEndDay"
            name="billEndDay"
            defaultValue=""
            onChange={(e) =>
              dispatch({
                type: "SET_UTILITY_DATA",
                payload: {
                  ...utilityData,
                  enddate: {
                    ...utilityData.enddate,
                    day: parseInt(e.target.value),
                  },
                },
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
            id="billEndMonth"
            name="billEndMonth"
            defaultValue=""
            onChange={(e) =>
              dispatch({
                type: "SET_UTILITY_DATA",
                payload: {
                  ...utilityData,
                  enddate: {
                    ...utilityData.enddate,
                    month: parseInt(e.target.value),
                  },
                },
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
            id="billEndYear"
            name="billEndYear"
            defaultValue=""
            onChange={(e) =>
              dispatch({
                type: "SET_UTILITY_DATA",
                payload: {
                  ...utilityData,
                  enddate: {
                    ...utilityData.enddate,
                    year: parseInt(e.target.value),
                  },
                },
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
