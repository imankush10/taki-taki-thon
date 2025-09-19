"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export function MetricCard({ title, value, unit, rating, icon, trend }) {
  const getRatingColor = (rating) => {
    switch (rating) {
      case "low":
        return "text-green-400 bg-green-900/30";
      case "moderate":
        return "text-yellow-400 bg-yellow-900/30";
      case "high":
        return "text-red-400 bg-red-900/30";
      default:
        return "text-gray-400 bg-gray-900/30";
    }
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return <TrendingUp className="w-4 h-4 text-red-500" />;
    if (trend < 0) return <TrendingDown className="w-4 h-4 text-green-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-800 hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-lg bg-blue-900/30 text-blue-400">
          {icon}
        </div>
        {trend !== undefined && (
          <div className="flex items-center gap-1">
            {getTrendIcon(trend)}
            <span className="text-xs text-gray-400">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>

      <h3 className="text-lg font-semibold text-white mb-2">
        {title}
      </h3>

      <div className="flex items-end justify-between">
        <div>
          <span className="text-3xl font-bold text-white">
            {value}
          </span>
          <span className="text-lg text-gray-400 ml-1">{unit}</span>
        </div>

        <div
          className={`px-3 py-1 rounded-full text-xs font-medium ${getRatingColor(
            rating
          )}`}
        >
          {rating} impact
        </div>
      </div>
    </motion.div>
  );
}
