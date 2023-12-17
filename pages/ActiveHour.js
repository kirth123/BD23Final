import TrafficChart from "./Charts"; // Adjust the import path as necessary
import React from "react";
import { useTheme, Paper, Typography } from "@mui/material";

const ActiveHoursPage = () => {
  const theme = useTheme();
  return (
    <>
      <Typography variant="h6" color="text.primary">
        Active Hours
      </Typography>
      <TrafficChart />
    </>
  );
};

export default ActiveHoursPage;
