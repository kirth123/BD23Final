import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import Dashboard from "./components/Dashboard";
import {  Typography } from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const TrendsChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/trendAnalysis");
        const rawData = await response.json();

        // Extract all unique years and sort them to use as labels
        const years = [...new Set(rawData.map((item) => item._id.year))].sort(
          (a, b) => a - b
        );

        // Create a dataset for each unique tag
        const datasets = rawData.reduce((acc, item) => {
          const tag = item._id.tag;
          const yearIndex = years.indexOf(item._id.year);

          // Find or create the dataset for the tag
          let dataset = acc.find((ds) => ds.label === tag);
          if (!dataset) {
            dataset = {
              label: tag,
              data: new Array(years.length).fill(0), // Initialize with zeros
              borderColor: generateColor(acc.length), // Generate a color based on the dataset's index
              fill: false,
              tension: 0.1,
            };
            acc.push(dataset);
          }

          // Update the dataset for the year with the count
          dataset.data[yearIndex] = item.count;
          return acc;
        }, []);

        setChartData({
          labels: years,
          datasets: datasets,
        });
      } catch (error) {
        console.error("Error fetching trend data:", error);
      }
    };

    fetchData();
  }, []);

  // Function to generate distinct colors for each dataset
  const generateColor = (index) => {
    const hue = index * 137.508; // Use golden angle approximation for distribution
    return `hsl(${hue}, 70%, 50%)`;
  };

  return (
    <>
      <Dashboard>
        <div style={{ width: "600px", height: "400px" }}>
          <Line
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                  labels: {
                    usePointStyle: true,
                  },
                },
                title: {
                  display: true,
                  text: "Trend Analysis by Tags Over Years",
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: "Count",
                  },
                },
                x: {
                  title: {
                    display: true,
                    text: "Year",
                  },
                },
              },
            }}
          />
        </div>
      </Dashboard>
    </>
  );
};

export default TrendsChart;
