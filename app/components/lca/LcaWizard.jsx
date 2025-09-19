"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { Label } from "../ui/Label";
import { Input } from "../ui/Input";
import { Spinner } from "../ui/Spinner";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Zap,
  Recycle,
  Truck,
  Target,
  Factory,
} from "lucide-react";
import useLcaStore from "@/app/store/lcaStore";

export function LcaWizard() {
  const router = useRouter();

  const {
    currentProject,
    currentStep,
    isLoading,
    error,
    updateProject,
    setCurrentStep,
    setLoading,
    setError,
    generateDummyResults,
  } = useLcaStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateProject({
      [name]:
        name === "rawMaterialPercentage" || name === "transportDistance"
          ? Number(value)
          : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const results = generateDummyResults();
      router.push(`/lca/results/${results.projectId}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () =>
    setCurrentStep(currentStep < 3 ? currentStep + 1 : currentStep);
  const prevStep = () =>
    setCurrentStep(currentStep > 1 ? currentStep - 1 : currentStep);

  const steps = [
    {
      title: "Project Basics",
      icon: <Factory className="w-6 h-6" />,
      description: "Define your project and material type",
    },
    {
      title: "Materials & Energy",
      icon: <Zap className="w-6 h-6" />,
      description: "Specify material composition and energy sources",
    },
    {
      title: "Logistics & End-of-Life",
      icon: <Truck className="w-6 h-6" />,
      description: "Transportation and disposal considerations",
    },
  ];

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <Factory className="w-16 h-16 mx-auto mb-4 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Project Setup
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Let's start with the basics of your metal product
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="projectName" className="text-lg font-medium">
                  Project Name
                </Label>
                <Input
                  id="projectName"
                  name="projectName"
                  value={currentProject.projectName}
                  onChange={handleChange}
                  placeholder="e.g., High-Grade Copper Wire Manufacturing"
                  className="h-12 text-lg"
                  required
                />
              </div>

              <div>
                <Label htmlFor="metal" className="text-lg font-medium">
                  Metal Type
                </Label>
                <select
                  id="metal"
                  name="metal"
                  value={currentProject.metal}
                  onChange={handleChange}
                  className="w-full h-12 px-4 text-lg border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="aluminium">Aluminium</option>
                  <option value="copper">Copper</option>
                </select>
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <Recycle className="w-16 h-16 mx-auto mb-4 text-green-600" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Material Composition
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Define your material sources and energy consumption
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-6 rounded-xl">
                <Label
                  htmlFor="rawMaterialPercentage"
                  className="text-lg font-medium mb-4 block"
                >
                  Material Composition
                </Label>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-green-600">
                    Recycled: {100 - currentProject.rawMaterialPercentage}%
                  </span>
                  <span className="text-sm font-medium text-orange-600">
                    Raw: {currentProject.rawMaterialPercentage}%
                  </span>
                </div>
                <input
                  id="rawMaterialPercentage"
                  name="rawMaterialPercentage"
                  type="range"
                  min="0"
                  max="100"
                  value={currentProject.rawMaterialPercentage}
                  onChange={handleChange}
                  className="w-full h-3 bg-gradient-to-r from-green-200 to-orange-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>0% Raw</span>
                  <span>100% Raw</span>
                </div>
              </div>

              <div>
                <Label
                  htmlFor="energySource"
                  className="text-lg font-medium flex items-center gap-2"
                >
                  <Zap className="w-5 h-5" />
                  Primary Energy Source
                </Label>
                <select
                  id="energySource"
                  name="energySource"
                  value={currentProject.energySource}
                  onChange={handleChange}
                  className="w-full h-12 px-4 text-lg border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="grid">Grid (Conventional)</option>
                  <option value="solar">Solar Power</option>
                  <option value="wind">Wind Power</option>
                </select>
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <Target className="w-16 h-16 mx-auto mb-4 text-purple-600" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Logistics & Lifecycle
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Transportation and end-of-life scenarios
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <Label
                  htmlFor="transportDistance"
                  className="text-lg font-medium flex items-center gap-2"
                >
                  <Truck className="w-5 h-5" />
                  Transport Distance (km)
                </Label>
                <Input
                  id="transportDistance"
                  name="transportDistance"
                  type="number"
                  value={currentProject.transportDistance}
                  onChange={handleChange}
                  placeholder="e.g., 500"
                  className="h-12 text-lg"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Average distance from manufacturing to end-user
                </p>
              </div>

              <div>
                <Label
                  htmlFor="endOfLifeOption"
                  className="text-lg font-medium flex items-center gap-2"
                >
                  <Recycle className="w-5 h-5" />
                  End-of-Life Scenario
                </Label>
                <select
                  id="endOfLifeOption"
                  name="endOfLifeOption"
                  value={currentProject.endOfLifeOption}
                  onChange={handleChange}
                  className="w-full h-12 px-4 text-lg border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="recycle">Recycle</option>
                  <option value="reuse">Reuse</option>
                  <option value="landfill">Landfill</option>
                </select>
                <p className="text-sm text-gray-500 mt-1">
                  Expected disposal method at end of product life
                </p>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <motion.div
                className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                  currentStep > index + 1
                    ? "bg-green-500 border-green-500 text-white"
                    : currentStep === index + 1
                    ? "bg-blue-500 border-blue-500 text-white"
                    : "bg-gray-100 border-gray-300 text-gray-400 dark:bg-gray-700 dark:border-gray-600"
                }`}
                whileHover={{ scale: 1.05 }}
              >
                {currentStep > index + 1 ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 bg-white rounded-full"
                  />
                ) : (
                  step.icon
                )}
              </motion.div>
              {index < steps.length - 1 && (
                <div
                  className={`h-1 w-24 mx-4 transition-all duration-300 ${
                    currentStep > index + 1
                      ? "bg-green-500"
                      : "bg-gray-200 dark:bg-gray-600"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {steps[currentStep - 1].title}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Step {currentStep} of {steps.length}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <Card className="overflow-hidden shadow-xl border-0 bg-white dark:bg-gray-800">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">{getStepContent()}</AnimatePresence>

            <div className="mt-8 flex justify-between items-center">
              <Button
                type="button"
                variant="secondary"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2 px-6 py-3"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>

              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-lg"
                >
                  {isLoading ? (
                    <>
                      <Spinner className="w-5 h-5" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Target className="w-5 h-5" />
                      Generate Analysis
                    </>
                  )}
                </Button>
              )}
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
              >
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </motion.div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
