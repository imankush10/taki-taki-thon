"use client";

import React from "react";
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

export function ImpactChart({ data }) {
  if (!data) return null;

  const impacts = Object.entries(data).map(([key, value]) => ({
    name: key.replace(/([A-Z])/g, " $1").trim(),
    value: value.value,
    unit: value.unit,
    rating: value.rating,
  }));

  const getBarColor = (rating) => {
    switch (rating) {
      case "low":
        return "rgba(16, 185, 129, 0.8)"; // Green
      case "moderate":
        return "rgba(245, 158, 11, 0.8)"; // Yellow
      case "high":
        return "rgba(239, 68, 68, 0.8)"; // Red
      default:
        return "rgba(107, 114, 128, 0.8)"; // Gray
    }
  };

  const getBorderColor = (rating) => {
    switch (rating) {
      case "low":
        return "rgba(16, 185, 129, 1)";
      case "moderate":
        return "rgba(245, 158, 11, 1)";
      case "high":
        return "rgba(239, 68, 68, 1)";
      default:
        return "rgba(107, 114, 128, 1)";
    }
  };

  const chartData = {
    labels: impacts.map((impact) => impact.name),
    datasets: [
      {
        label: "Environmental Impact",
        data: impacts.map((impact) => impact.value),
        backgroundColor: impacts.map((impact) => getBarColor(impact.rating)),
        borderColor: impacts.map((impact) => getBorderColor(impact.rating)),
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "#374151",
        borderWidth: 1,
        callbacks: {
          label: function (context) {
            const impact = impacts[context.dataIndex];
            return `${impact.value} ${impact.unit} (${impact.rating} impact)`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(148, 163, 184, 0.3)",
          lineWidth: 1,
        },
        ticks: {
          color: "#f8fafc",
          font: {
            size: 12,
            weight: "600",
          },
          maxRotation: 45,
        },
        border: {
          color: "#94a3b8",
          width: 2,
        },
      },
      y: {
        grid: {
          color: "rgba(148, 163, 184, 0.3)",
          lineWidth: 1,
        },
        ticks: {
          color: "#f8fafc",
          font: {
            size: 12,
            weight: "600",
          },
        },
        border: {
          color: "#94a3b8",
          width: 2,
        },
      },
    },
    animation: {
      duration: 1500,
      easing: "easeInOutQuart",
    },
  };

  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-600">
      <h3 className="text-lg font-semibold mb-4 text-white">
        Environmental Impact Analysis
      </h3>
      <div className="h-80">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
