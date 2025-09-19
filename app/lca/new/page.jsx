"use client";

import { motion } from "framer-motion";
import { LcaWizard } from "@/app/components/lca/LcaWizard";
import { ArrowLeft, Target } from "lucide-react";
import Link from "next/link";
import { Button } from "@/app/components/ui/Button";

export default function NewLcaPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="secondary" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Home
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-900/30 rounded-lg">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    New LCA Analysis
                  </h1>
                  <p className="text-sm text-gray-300">
                    Assess the environmental impact of your metal product
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center"
        >
          <div className="w-full max-w-4xl">
            <div className="text-center mb-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 px-4 py-2 rounded-full text-green-700 dark:text-green-300 text-sm font-medium mb-4"
              >
                <Target className="w-4 h-4" />
                Life Cycle Assessment Wizard
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Analyze Your Environmental Impact
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Follow our step-by-step process to evaluate the environmental
                footprint and circular economy potential of your metal product.
              </p>
            </div>

            <LcaWizard />
          </div>
        </motion.div>
      </main>
    </div>
  );
}
