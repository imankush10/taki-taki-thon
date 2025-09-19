import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "../ui/Card";
import { Button } from "../ui/Button";
import { Spinner } from "../ui/Spinner";
import {
  Brain,
  Sparkles,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Target,
  Lightbulb,
} from "lucide-react";

export default function AIInsights({
  projectData,
  environmentalImpacts,
  circularFlowData,
}) {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateInsights = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectData,
          environmentalImpacts,
          circularFlowData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate insights");
      }

      setInsights(data.insights);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const parseInsights = (text) => {
    const sections = text.split(/\n(?=\d\.|(?:\*\*|##))/);
    return sections.map((section, index) => {
      const lines = section.trim().split("\n");
      const title = lines[0]
        .replace(/^\d+\.\s*|\*\*|\##/g, "")
        .replace(/\*\*/g, "");
      const content = lines.slice(1).join("\n").trim();

      return { title, content, index };
    });
  };

  return (
    <Card className="shadow-xl border-0 bg-gradient-to-br from-purple-900/10 to-blue-900/10">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-900/30 rounded-lg">
            <Brain className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              AI-Powered Insights
              <Sparkles className="w-5 h-5 text-yellow-400" />
            </h2>
            <p className="text-gray-300">
              Get intelligent analysis and recommendations powered by Google
              Gemini
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {!insights && !loading && (
          <div className="text-center py-8">
            <Brain className="w-16 h-16 mx-auto mb-4 text-purple-400 opacity-50" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Unlock AI-Powered Analysis
            </h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Get personalized insights, recommendations, and sustainability
              ratings tailored to your specific LCA data using advanced AI
              analysis.
            </p>
            <Button
              onClick={generateInsights}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8 py-3"
            >
              <Brain className="w-5 h-5 mr-2" />
              Generate AI Insights
            </Button>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center"
            >
              <div className="relative mb-6">
                <Spinner className="w-12 h-12 text-purple-500" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0"
                >
                  <Brain className="w-12 h-12 text-purple-400 opacity-30" />
                </motion.div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                AI is analyzing your data...
              </h3>
              <p className="text-gray-400">
                This may take a few moments while we generate personalized
                insights
              </p>
            </motion.div>
          </div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 text-center"
          >
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
            <h3 className="text-lg font-semibold text-red-300 mb-2">
              Unable to Generate Insights
            </h3>
            <p className="text-red-200 mb-4">{error}</p>
            <Button
              onClick={generateInsights}
              variant="secondary"
              className="bg-red-800/50 hover:bg-red-700/50 border-red-500/50"
            >
              Try Again
            </Button>
          </motion.div>
        )}

        {insights && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-green-300 font-medium">
                  Analysis Complete
                </span>
              </div>
              <Button
                onClick={generateInsights}
                variant="secondary"
                size="sm"
                className="bg-purple-800/50 hover:bg-purple-700/50"
              >
                <Brain className="w-4 h-4 mr-2" />
                Regenerate
              </Button>
            </div>

            <div className="prose prose-invert max-w-none">
              <div className="whitespace-pre-line text-gray-100 leading-relaxed">
                {insights.split("\n").map((line, index) => {
                  if (
                    line.trim().startsWith("**") &&
                    line.trim().endsWith("**")
                  ) {
                    return (
                      <h3
                        key={index}
                        className="text-xl font-bold text-purple-300 mt-6 mb-3 flex items-center gap-2"
                      >
                        <Target className="w-5 h-5" />
                        {line.replace(/\*\*/g, "")}
                      </h3>
                    );
                  }
                  if (
                    line.trim().startsWith("-") ||
                    line.trim().startsWith("•")
                  ) {
                    return (
                      <div
                        key={index}
                        className="flex items-start gap-3 mb-2 ml-4"
                      >
                        <Lightbulb className="w-4 h-4 text-yellow-400 mt-1 flex-shrink-0" />
                        <span className="text-gray-200">
                          {line.replace(/^[-•]\s*/, "")}
                        </span>
                      </div>
                    );
                  }
                  if (line.trim()) {
                    return (
                      <p
                        key={index}
                        className="text-gray-200 mb-3 leading-relaxed"
                      >
                        {line}
                      </p>
                    );
                  }
                  return <br key={index} />;
                })}
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
