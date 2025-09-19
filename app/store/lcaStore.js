"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const useLcaStore = create(
  persist(
    (set, get) => ({
      // Current project data
      currentProject: {
        projectName: "",
        metal: "aluminium",
        rawMaterialPercentage: 80,
        energySource: "grid",
        transportDistance: 500,
        endOfLifeOption: "recycle",
      },

      // Results data
      currentResults: null,

      // UI state
      isLoading: false,
      currentStep: 1,
      error: null,

      // Actions
      updateProject: (updates) =>
        set((state) => ({
          currentProject: { ...state.currentProject, ...updates },
        })),

      setCurrentStep: (step) => set({ currentStep: step }),

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      setResults: (results) => set({ currentResults: results }),

      resetProject: () =>
        set({
          currentProject: {
            projectName: "",
            metal: "aluminium",
            rawMaterialPercentage: 80,
            energySource: "grid",
            transportDistance: 500,
            endOfLifeOption: "recycle",
          },
          currentStep: 1,
          error: null,
        }),

      // Generate dummy results for demo purposes
      generateDummyResults: () => {
        const project = get().currentProject;
        const projectId = `proj_${Date.now()}`;

        // Calculate dummy impacts based on form data
        const baseEmissions = project.metal === "aluminium" ? 12.5 : 8.3;
        const recyclingFactor = (100 - project.rawMaterialPercentage) / 100;
        const energyFactor = project.energySource === "grid" ? 1.0 : 0.3;
        const transportFactor = project.transportDistance / 1000;

        const carbonFootprint = (
          baseEmissions * (1 - recyclingFactor * 0.6) * energyFactor +
          transportFactor * 0.5
        ).toFixed(2);
        const waterUsage = (
          (project.metal === "aluminium" ? 1500 : 900) *
          (1 - recyclingFactor * 0.4)
        ).toFixed(0);
        const energyConsumption = (
          (project.metal === "aluminium" ? 45 : 28) * energyFactor
        ).toFixed(1);

        const results = {
          projectId,
          timestamp: new Date().toISOString(),
          projectData: project,
          environmentalImpacts: {
            carbonFootprint: {
              value: parseFloat(carbonFootprint),
              unit: "kg CO2-eq",
              rating: parseFloat(carbonFootprint) > 10 ? "high" : "moderate",
            },
            waterUsage: {
              value: parseInt(waterUsage),
              unit: "liters",
              rating: parseInt(waterUsage) > 1000 ? "high" : "low",
            },
            energyConsumption: {
              value: parseFloat(energyConsumption),
              unit: "MJ",
              rating: parseFloat(energyConsumption) > 35 ? "high" : "moderate",
            },
            wasteGeneration: {
              value: (Math.random() * 5 + 1).toFixed(1),
              unit: "kg",
              rating: "low",
            },
          },
          recommendations: [
            `Increase recycled content to ${Math.min(
              95,
              project.rawMaterialPercentage + 20
            )}% to reduce carbon footprint`,
            project.energySource === "grid"
              ? "Switch to renewable energy sources for manufacturing"
              : "Continue using renewable energy sources",
            "Optimize transport routes to reduce emissions",
            "Implement circular design principles for better end-of-life recovery",
          ],
          circularFlowData: {
            materialFlow: [
              {
                stage: "Raw Material",
                input: project.rawMaterialPercentage,
                output: project.rawMaterialPercentage,
              },
              {
                stage: "Manufacturing",
                input: project.rawMaterialPercentage,
                output: project.rawMaterialPercentage * 0.95,
              },
              {
                stage: "Use Phase",
                input: project.rawMaterialPercentage * 0.95,
                output: project.rawMaterialPercentage * 0.9,
              },
              {
                stage: "End of Life",
                input: project.rawMaterialPercentage * 0.9,
                output:
                  project.endOfLifeOption === "recycle"
                    ? project.rawMaterialPercentage * 0.8
                    : 0,
              },
            ],
            circularityScore:
              project.endOfLifeOption === "recycle"
                ? 75
                : project.endOfLifeOption === "reuse"
                ? 85
                : 15,
          },
        };

        set({ currentResults: results });
        return results;
      },
    }),
    {
      name: "lca-storage",
      partialize: (state) => ({
        currentProject: state.currentProject,
        currentResults: state.currentResults,
      }),
    }
  )
);

export default useLcaStore;
