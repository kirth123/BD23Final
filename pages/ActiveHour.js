import TrafficChart from "./Charts"; // Adjust the import path as necessary
import React from "react";
import { useTheme, Paper, Typography } from "@mui/material";
import Dashboard from "./components/Dashboard";
const ActiveHoursPage = () => {
  const theme = useTheme();
  return (
    <>
        <TrafficChart />
    </>
  );
};

export default ActiveHoursPage;
