import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
import Dashboard from "./components/Dashboard";
import { Typography } from "@mui/material";
const TrafficChart = () => {
  const [chartData, setChartData] = useState({
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [
      {
        label: "Questions",
        data: [],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
      {
        label: "Answers",
        data: [],
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/activityByHour");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Fetched data is not an array");
        }

        const questions = new Array(24).fill(0);
        const answers = new Array(24).fill(0);

        data.forEach((item) => {
          const hour = item._id.hour;
          const count = item.count;
          if (item._id.type === 1) {
            questions[hour] += count;
          } else if (item._id.type === 2) {
            answers[hour] += count;
          }
        });

        setChartData((prevChartData) => ({
          ...prevChartData,
          datasets: [
            { ...prevChartData.datasets[0], data: questions },
            { ...prevChartData.datasets[1], data: answers },
          ],
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle the error based on your application's needs
      }
    };

    fetchData();
  }, []);

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: "Hour of the Day",
        },
      },
      y: {
        title: {
          display: true,
          text: "Number of Posts",
        },
        beginAtZero: true,
      },
    },
    plugins: {
      title: {
        display: true,
        text: 'Activity by Hour',
        position: 'top',
      },
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <>
      <Dashboard>
        <div style={{ width: "600px", height: "400px" }}>
          <Bar data={chartData} options={options} />
        </div>
      </Dashboard>
    </>
  );
};

export default TrafficChart;
