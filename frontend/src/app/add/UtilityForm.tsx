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
          value={utilityData.kWh ? utilityData.kWh : ""}
          onChange={(e) =>
            dispatch({
              type: "SET_UTILITY_DATA",
              payload: { ...utilityData, kWh: parseFloat(e.target.value) },
            })
          }
        />
      </div>
      <div className={styles.formSection}>
        <label htmlFor="state">State:</label>
        <select
          id="state"
          name="state"
          value={utilityData.state ? utilityData.state : ""}
          onChange={(e) =>
            dispatch({
              type: "SET_UTILITY_DATA",
              payload: { ...utilityData, state: e.target.value },
            })
          }
        >
          <option value="" disabled>
            Select...
          </option>
          {[
            // List of US states abbreviated
            "AL",
            "AK",
            "AZ",
            "AR",
            "CA",
            "CO",
            "CT",
            "DE",
            "FL",
            "GA",
            "HI",
            "ID",
            "IL",
            "IN",
            "IA",
            "KS",
            "KY",
            "LA",
            "ME",
            "MD",
            "MA",
            "MI",
            "MN",
            "MS",
            "MO",
            "MT",
            "NE",
            "NV",
            "NH",
            "NJ",
            "NM",
            "NY",
            "NC",
            "ND",
            "OH",
            "OK",
            "OR",
            "PA",
            "RI",
            "SC",
            "SD",
            "TN",
            "TX",
            "UT",
            "VT",
            "VA",
            "WA",
            "WV",
            "WI",
            "WY",
          ].map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.formSection}>
        <label htmlFor="billStartDate">Bill Start Date</label>
        <div className={styles.date}>
          <select
            id="billStartDay"
            name="billStartDay"
            value={utilityData.startdate.day ? utilityData.startdate.day : ""}
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
            value={
              utilityData.startdate.month ? utilityData.startdate.month : ""
            }
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
            value={utilityData.startdate.year ? utilityData.startdate.year : ""}
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
            value={utilityData.enddate.day ? utilityData.enddate.day : ""}
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
            value={utilityData.enddate.month ? utilityData.enddate.month : ""}
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
            value={utilityData.enddate.year ? utilityData.enddate.year : ""}
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
