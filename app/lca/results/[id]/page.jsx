"use client";

import { useEffect, useState, use } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { ExportModal } from "@/app/components/ui/ExportModal";
import { ImpactChart } from "@/app/components/lca/ImpactChart";
import { CircularityFlow } from "@/app/components/lca/CircularityFlow";
import { MetricCard } from "@/app/components/lca/MetricCard";
import AIInsights from "@/app/components/lca/AIInsights";
import {
  ArrowLeft,
  Download,
  Share2,
  RefreshCw,
  Leaf,
  Droplets,
  Zap,
  Trash2,
  Target,
  TrendingUp,
  Award,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import useLcaStore from "@/app/store/lcaStore";

export default function LcaResultsPage({ params }) {
  // Unwrap the async params using React.use()
  const resolvedParams = use(params);
  const [results, setResults] = useState(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const { currentResults } = useLcaStore();

  // Export functionality
  const handleExport = (format) => {
    // Create a detailed export object
    const dataToExport = {
      projectInfo: {
        name: results.projectData?.projectName || "LCA Analysis",
        id: results.projectId,
        date: new Date(results.timestamp).toLocaleDateString(),
        metal: results.projectData?.metal,
        rawMaterialPercentage: results.projectData?.rawMaterialPercentage,
        energySource: results.projectData?.energySource,
        transportDistance: results.projectData?.transportDistance,
        endOfLifeOption: results.projectData?.endOfLifeOption,
      },
      environmentalImpacts: results.environmentalImpacts,
      circularityScore: results.circularFlowData?.circularityScore,
      recommendations: results.recommendations,
      summary: {
        totalImpactScore: "Good",
        analysisDate: new Date(results.timestamp).toLocaleString(),
      }
    };

    // Export based on format
    if (format === "json") {
      exportAsJSON(dataToExport);
    } else if (format === "csv") {
      exportAsCSV(dataToExport);
    } else if (format === "text") {
      exportAsTextReport(dataToExport);
    }
  };

  const openExportModal = () => {
    setIsExportModalOpen(true);
  };

  const exportAsJSON = (data) => {
    const jsonString = JSON.stringify(data, null, 2);
    downloadFile(jsonString, 'application/json', 'json');
  };

  const exportAsCSV = (data) => {
    let csvContent = "Category,Metric,Value,Unit,Rating\n";
    
    // Add environmental impacts
    Object.entries(data.environmentalImpacts).forEach(([key, value]) => {
      csvContent += `Environmental Impact,${key.replace(/([A-Z])/g, ' $1').trim()},${value.value},${value.unit},${value.rating}\n`;
    });
    
    // Add project info
    Object.entries(data.projectInfo).forEach(([key, value]) => {
      csvContent += `Project Info,${key.replace(/([A-Z])/g, ' $1').trim()},${value},,\n`;
    });
    
    // Add circularity score
    csvContent += `Circularity,Score,${data.circularityScore},%,\n`;
    
    downloadFile(csvContent, 'text/csv', 'csv');
  };

  const exportAsTextReport = (data) => {
    const report = `
LCA ANALYSIS REPORT
==================

Project Information:
- Name: ${data.projectInfo.name}
- ID: ${data.projectInfo.id}
- Analysis Date: ${data.projectInfo.date}
- Metal Type: ${data.projectInfo.metal}
- Raw Material Percentage: ${data.projectInfo.rawMaterialPercentage}%
- Energy Source: ${data.projectInfo.energySource}
- Transport Distance: ${data.projectInfo.transportDistance} km
- End-of-Life Option: ${data.projectInfo.endOfLifeOption}

Environmental Impact Results:
${Object.entries(data.environmentalImpacts).map(([key, value]) => 
  `- ${key.replace(/([A-Z])/g, ' $1').trim()}: ${value.value} ${value.unit} (${value.rating} impact)`
).join('\n')}

Circularity Score: ${data.circularityScore}%

Recommendations:
${data.recommendations.map((rec, index) => `${index + 1}. ${rec}`).join('\n')}

Generated on: ${data.summary.analysisDate}
`;
    
    downloadFile(report, 'text/plain', 'txt');
  };

  const downloadFile = (content, mimeType, extension) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `LCA_Analysis_${results.projectData?.projectName?.replace(/\s+/g, '_') || 'Report'}_${new Date().toISOString().split('T')[0]}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Share functionality
  const handleShare = async () => {
    const shareData = {
      title: `LCA Analysis - ${results.projectData?.projectName || 'Metal Analysis'}`,
      text: `Check out this Life Cycle Assessment for ${results.projectData?.metal} with a circularity score of ${results.circularFlowData?.circularityScore}%`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Error sharing:', error);
        fallbackShare();
      }
    } else {
      fallbackShare();
    }
  };

  const fallbackShare = () => {
    // Copy URL to clipboard as fallback
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert('Link copied to clipboard! You can now share it.');
    }).catch(() => {
      // Final fallback - show the URL
      const urlToCopy = window.location.href;
      prompt('Copy this link to share:', urlToCopy);
    });
  };

  useEffect(() => {
    // Try to get results from Zustand store first
    if (currentResults && currentResults.projectId === resolvedParams.id) {
      setResults(currentResults);
    } else {
      // Fallback to localStorage
      const storedResults = localStorage.getItem("lcaResult");
      if (storedResults) {
        const parsedResults = JSON.parse(storedResults);
        if (parsedResults.projectId === resolvedParams.id) {
          setResults(parsedResults);
        }
      }
    }
  }, [resolvedParams.id, currentResults]);

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <RefreshCw className="w-12 h-12 mx-auto mb-4 text-blue-500 animate-spin" />
          <p className="text-xl text-gray-300">Loading results...</p>
          <p className="text-sm text-gray-500 mt-2">
            If results don't appear, they may not be found
          </p>
        </motion.div>
      </div>
    );
  }

  const getMetricIcon = (key) => {
    const icons = {
      carbonFootprint: <Leaf className="w-6 h-6" />,
      waterUsage: <Droplets className="w-6 h-6" />,
      energyConsumption: <Zap className="w-6 h-6" />,
      wasteGeneration: <Trash2 className="w-6 h-6" />,
    };
    return icons[key] || <Target className="w-6 h-6" />;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/lca/new">
                <Button variant="secondary" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  New Analysis
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {results.projectData?.projectName || "LCA Results"}
                </h1>
                <p className="text-sm text-gray-400">
                  Project ID: {results.projectId} •{" "}
                  {new Date(results.timestamp).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button 
                variant="secondary" 
                className="flex items-center gap-2"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <Button 
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600"
                onClick={openExportModal}
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Overview Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {Object.entries(results.environmentalImpacts).map(
            ([key, value], index) => (
              <motion.div
                className="capitalize"
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <MetricCard
                  title={key.replace(/([A-Z])/g, " $1").trim()}
                  value={value.value}
                  unit={value.unit}
                  rating={value.rating}
                  icon={getMetricIcon(key)}
                  trend={Math.random() * 20 - 10} // Random trend for demo
                />
              </motion.div>
            )
          )}
        </motion.div>

        {/* Circularity Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-r from-green-500 to-blue-600 text-white border-0 shadow-xl">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Circularity Score</h2>
                  <p className="text-green-100">
                    Your product's circular economy performance
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-5xl font-bold mb-2">
                    {results.circularFlowData?.circularityScore || 75}%
                  </div>
                  <div className="flex items-center gap-2 text-green-100">
                    <Award className="w-5 h-5" />
                    <span className="text-sm">
                      {results.circularFlowData?.circularityScore >= 70
                        ? "Excellent"
                        : results.circularFlowData?.circularityScore >= 50
                        ? "Good"
                        : "Needs Improvement"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Visualizations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <ImpactChart data={results.environmentalImpacts} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <CircularityFlow data={results.circularFlowData} />
          </motion.div>
        </div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="shadow-xl border-0">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Improvement Recommendations
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Actionable steps to enhance your environmental performance
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.recommendations.map((rec, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {rec}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 px-2 py-1 rounded-full">
                          High Impact
                        </span>
                        <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 px-2 py-1 rounded-full">
                          Easy to Implement
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI-Powered Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <AIInsights
            projectData={results.projectData}
            environmentalImpacts={results.environmentalImpacts}
            circularFlowData={results.circularFlowData}
          />
        </motion.div>

        {/* Raw Data (Collapsible) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="shadow-lg border-0">
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Detailed Analysis Data
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Complete breakdown of the analysis parameters and results
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Project Parameters
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Metal Type:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white capitalize">
                        {results.projectData?.metal}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Raw Material %:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {results.projectData?.rawMaterialPercentage}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Energy Source:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white capitalize">
                        {results.projectData?.energySource}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Transport Distance:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {results.projectData?.transportDistance} km
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        End-of-Life:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white capitalize">
                        {results.projectData?.endOfLifeOption}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Analysis Summary
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Total Impact Score:
                      </span>
                      <span className="font-medium text-green-600">Good</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Circularity Score:
                      </span>
                      <span className="font-medium text-blue-600">
                        {results.circularFlowData?.circularityScore}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Generated:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {new Date(results.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
        projectName={results.projectData?.projectName || "LCA Analysis"}
      />
    </div>
  );
}
