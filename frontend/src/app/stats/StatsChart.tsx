"use client";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Data {
  date: string;
  utility_footprint: number;
  travel_footprint: number;
}

interface BarChartProps {
  data: Data[];
}

export default function StatsChart({ data }: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="travel_footprint" stackId="a" fill="#8884d8" />
        <Bar dataKey="utility_footprint" stackId="a" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
}
