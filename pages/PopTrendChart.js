import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import Dashboard from "./components/Dashboard";
import {  Typography } from "@mui/material";

ChartJS.register(ArcElement, Tooltip, Legend);

const PopTrendChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        hoverBackgroundColor: [],
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/mostPopTags");
        const data = await response.json();

        const labels = data.map((item) => item._id);
        const counts = data.map((item) => item.count);
        const backgroundColors = data.map(
          (_, index) => `hsl(${(index / data.length) * 360}, 70%, 70%)`
        );

        setChartData({
          labels,
          datasets: [
            {
              data: counts,
              backgroundColor: backgroundColors,
              hoverBackgroundColor: backgroundColors,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Popular Tags on Stack Overflow",
      },
    },
  };

  return (
    <>
      <Typography variant="h6" color="text.primary">
       Popular Tags
      </Typography>
      <Dashboard>
        <div style={{ width: "600px", height: "400px" }}>
          <Pie data={chartData} options={options} />
        </div>
      </Dashboard>
    </>
  );
};

export default PopTrendChart;
