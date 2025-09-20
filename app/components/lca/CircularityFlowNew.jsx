"use client";

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export function CircularityFlow({ data }) {
  if (!data || !data.materialFlow) return null;

  const stages = data.materialFlow;

  // Material Flow Line Chart
  const flowData = {
    labels: stages.map((stage) => stage.stage),
    datasets: [
      {
        label: "Material Input",
        data: stages.map((stage) => stage.input),
        borderColor: "rgba(59, 130, 246, 1)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "rgba(59, 130, 246, 1)",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 6,
      },
      {
        label: "Material Output",
        data: stages.map((stage) => stage.output),
        borderColor: "rgba(16, 185, 129, 1)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "rgba(16, 185, 129, 1)",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 6,
      },
    ],
  };

  const flowOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "#f8fafc",
          font: {
            size: 12,
            weight: "600",
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "#374151",
        borderWidth: 1,
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`;
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
            size: 11,
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
            size: 11,
            weight: "600",
          },
          callback: function (value) {
            return value + "%";
          },
        },
        border: {
          color: "#94a3b8",
          width: 2,
        },
      },
    },
    animation: {
      duration: 2000,
      easing: "easeInOutQuart",
    },
  };

  // Circularity Score Doughnut Chart
  const scoreData = {
    labels: ["Circularity Score", "Remaining"],
    datasets: [
      {
        data: [data.circularityScore, 100 - data.circularityScore],
        backgroundColor: [
          data.circularityScore >= 70
            ? "rgba(16, 185, 129, 0.8)"
            : data.circularityScore >= 50
            ? "rgba(245, 158, 11, 0.8)"
            : "rgba(239, 68, 68, 0.8)",
          "rgba(107, 114, 128, 0.2)",
        ],
        borderColor: [
          data.circularityScore >= 70
            ? "rgba(16, 185, 129, 1)"
            : data.circularityScore >= 50
            ? "rgba(245, 158, 11, 1)"
            : "rgba(239, 68, 68, 1)",
          "rgba(107, 114, 128, 0.5)",
        ],
        borderWidth: 3,
        cutout: "70%",
      },
    ],
  };

  const scoreOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
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
            if (context.dataIndex === 0) {
              return `Circularity Score: ${context.parsed}%`;
            }
            return null;
          },
        },
      },
    },
    animation: {
      duration: 2000,
      easing: "easeInOutQuart",
    },
  };

  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-600">
      <h3 className="text-lg font-semibold mb-4 text-white">
        Material Flow & Circularity
      </h3>

      {/* Material Flow Chart */}
      <div className="mb-8">
        <h4 className="text-md font-medium text-white mb-3">
          Material Flow Through Lifecycle
        </h4>
        <div className="h-48">
          <Line data={flowData} options={flowOptions} />
        </div>
      </div>

      {/* Circularity Score */}
      <div className="flex items-center justify-center">
        <div className="relative w-48 h-48">
          <Doughnut data={scoreData} options={scoreOptions} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-white">
              {data.circularityScore}%
            </span>
            <span className="text-sm text-gray-300 font-medium">
              Circularity Score
            </span>
            <span
              className={`text-xs px-2 py-1 rounded-full mt-1 ${
                data.circularityScore >= 70
                  ? "bg-green-900/30 text-green-300"
                  : data.circularityScore >= 50
                  ? "bg-yellow-900/30 text-yellow-300"
                  : "bg-red-900/30 text-red-300"
              }`}
            >
              {data.circularityScore >= 70
                ? "Excellent"
                : data.circularityScore >= 50
                ? "Good"
                : "Needs Improvement"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
