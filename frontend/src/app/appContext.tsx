"use client";
import React, { createContext, useReducer, type Dispatch } from "react";
type InitialStateProps = {
  loggedIn: boolean;
  travelData: {
    vehicle: string;
    distance: number;
    day: number;
    month: number;
    year: number;
  };
  utilityData: {
    kWh: number;
    startdate: { day: number; month: number; year: number };
    enddate: { day: number; month: number; year: number };
  };
};
const initialState = {
  loggedIn: false,
  travelData: { vehicle: "", distance: 0, day: 0, month: 0, year: 0 },
  utilityData: {
    kWh: 0,
    startdate: { day: 0, month: 0, year: 0 },
    enddate: { day: 0, month: 0, year: 0 },
  },
};

const reducer = (state: InitialStateProps, action: any) => {
  switch (action.type) {
    case "SET_LOGGED_IN":
      return { ...state, loggedIn: action.payload };
    case "SET_TRAVEL_DATA":
      return { ...state, travelData: action.payload };
    case "SET_UTILITY_DATA":
      return { ...state, utilityData: action.payload };
    default:
      return state;
  }
};

export const Context = createContext({
  state: initialState,
  dispatch: (() => undefined) as Dispatch<any>,
});

export const ContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
  );
};
