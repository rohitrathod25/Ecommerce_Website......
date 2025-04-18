import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto"; // Don't remove this

function LineChart({ chartData, multiAxis = false }) {
  console.log("Chart Data:", chartData);

  if (!chartData || !chartData.labels || chartData.labels.length === 0) {
    return <p>⚠ No chart data available.</p>;
  }

  const options = {
    plugins: {
      legend: {
        display: multiAxis,
      },
    },
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    scales: {
      crypto1: {
        position: "left",
      },
      crypto2: multiAxis
        ? {
            position: "right",
          }
        : undefined,
    },
  };

  return <Line data={chartData} options={options} />;
}

export default LineChart;
