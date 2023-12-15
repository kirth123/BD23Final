import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TrafficChart = () => {
  const [chartData, setChartData] = useState({
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [
      {
        label: 'Questions',
        data: [],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: 'Answers',
        data: [],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      }
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/activityByHour');
      const data = await response.json();
      const questions = new Array(24).fill(0);
      const answers = new Array(24).fill(0);

      data.forEach(item => {
        const hour = item._id.hour;
        const count = item.count;
        if (item._id.type === '1') {
          questions[hour] += count;
        } else if (item._id.type === '2') {
          answers[hour] += count;
        }
      });

      setChartData({
        ...chartData,
        datasets: [
          { ...chartData.datasets[0], data: questions },
          { ...chartData.datasets[1], data: answers }
        ]
      });
    };

    fetchData();
  }, []);

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Hour of the Day'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Number of Posts'
        },
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    },
    responsive: true,
    maintainAspectRatio: false
  };

  return (
    <div style={{ width: '600px', height: '400px' }}> {/* Adjust the size here */}
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default TrafficChart;
