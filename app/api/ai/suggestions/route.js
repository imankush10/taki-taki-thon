import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

export async function POST(request) {
  try {
    const { projectData } = await request.json();

    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Google Gemini API key not configured" },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 512,
      },
    });

    const prompt = `
    You are an environmental sustainability expert. Based on the following LCA project parameters, provide quick optimization suggestions:

    PROJECT: ${projectData.projectName}
    - Metal: ${projectData.metal}
    - Raw Material: ${projectData.rawMaterialPercentage}%
    - Energy: ${projectData.energySource}
    - Transport: ${projectData.transportDistance}km
    - End-of-Life: ${projectData.endOfLifeOption}

    Provide exactly 3 quick optimization tips in this format:
    1. [One specific actionable tip]
    2. [One specific actionable tip]
    3. [One specific actionable tip]

    Keep each tip under 15 words. Focus on immediate, practical improvements.
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const suggestions = response.text();

    return NextResponse.json({
      success: true,
      suggestions,
    });
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return NextResponse.json(
      { error: "Failed to generate suggestions" },
      { status: 500 }
    );
  }
}
