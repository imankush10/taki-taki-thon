import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Brain, Lightbulb, ChevronRight } from "lucide-react";
import { Button } from "../ui/Button";

export default function AISuggestions({ projectData, onApplySuggestion }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show suggestions after step 2 if project has enough data
    if (
      projectData.projectName &&
      projectData.metal &&
      projectData.energySource
    ) {
      setVisible(true);
      fetchSuggestions();
    }
  }, [projectData]);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/ai/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectData }),
      });

      if (response.ok) {
        const data = await response.json();
        const suggestionList = data.suggestions
          .split("\n")
          .filter((line) => line.trim().match(/^\d+\./))
          .map((line) => line.replace(/^\d+\.\s*/, "").trim());
        setSuggestions(suggestionList);
      }
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!visible || loading) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.5 }}
      className="mt-6 p-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg border border-purple-500/30"
    >
      <div className="flex items-center gap-2 mb-3">
        <Brain className="w-5 h-5 text-purple-400" />
        <h4 className="font-semibold text-purple-300">AI Quick Tips</h4>
      </div>

      {suggestions.length > 0 && (
        <div className="space-y-2">
          {suggestions.slice(0, 3).map((suggestion, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="flex items-start gap-2 text-sm"
            >
              <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
              <span className="text-gray-300">{suggestion}</span>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
