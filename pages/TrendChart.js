import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale,
  TimeSeriesScale
} from "chart.js";
import 'chartjs-adapter-moment'; // Import adapter
import { Line } from "react-chartjs-2";
import Dashboard from "./components/Dashboard";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale,
  TimeSeriesScale
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
        const { topTags, trendAnalysis } = await response.json();

        // Extract all unique year-month combinations and sort them
        const yearMonths = [...new Set(trendAnalysis.map(item => `${item._id.year}-${item._id.month.toString().padStart(2, '0')}`))].sort();

        // Create a dataset for each top tag
        const datasets = topTags.map(tag => {
          const data = new Array(yearMonths.length).fill(0);
          trendAnalysis.forEach(item => {
            if (item._id.tag === tag) {
              const yearMonth = `${item._id.year}-${item._id.month.toString().padStart(2, '0')}`;
              const index = yearMonths.indexOf(yearMonth);
              data[index] = item.count;
            }
          });
          return {
            label: tag,
            data: data.map((count, index) => ({ x: yearMonths[index], y: count })),
            borderColor: generateColor(),
            fill: false,
            tension: 0.1,
          };
        });

        setChartData({
          labels: yearMonths,
          datasets: datasets,
        });
      } catch (error) {
        console.error("Error fetching trend data:", error);
      }
    };

    fetchData();
  }, []);

  const generateColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 50%)`;
  };

  return (
    <>
      <Dashboard>
        <div style={{ width: "800px", height: "500px" }}>
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
                  text: "Monthly Trend Analysis by Tags",
                },
              },
              scales: {
                x: {
                  type: 'time',
                  time: {
                    unit: 'month',
                    displayFormats: {
                      month: 'YYYY-MM'
                    }
                  },
                  title: {
                    display: true,
                    text: "Year-Month",
                  },
                },
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: "Count",
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
