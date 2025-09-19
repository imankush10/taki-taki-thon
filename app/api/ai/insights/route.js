import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

export async function POST(request) {
  try {
    const { projectData, environmentalImpacts, circularFlowData } =
      await request.json();

    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Google Gemini API key not configured" },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 1024,
      },
    });

    const prompt = `
    You are an expert environmental consultant specializing in Life Cycle Assessment (LCA) for metal products. 
    
    Analyze the following LCA data and provide intelligent insights:

    PROJECT DATA:
    - Product: ${projectData.projectName}
    - Metal Type: ${projectData.metal}
    - Raw Material %: ${projectData.rawMaterialPercentage}%
    - Recycled Material %: ${100 - projectData.rawMaterialPercentage}%
    - Energy Source: ${projectData.energySource}
    - Transport Distance: ${projectData.transportDistance}km
    - End-of-Life: ${projectData.endOfLifeOption}

    ENVIRONMENTAL IMPACTS:
    - Carbon Footprint: ${environmentalImpacts.carbonFootprint?.value} ${
      environmentalImpacts.carbonFootprint?.unit
    } (${environmentalImpacts.carbonFootprint?.rating})
    - Water Usage: ${environmentalImpacts.waterUsage?.value} ${
      environmentalImpacts.waterUsage?.unit
    } (${environmentalImpacts.waterUsage?.rating})
    - Energy Consumption: ${environmentalImpacts.energyConsumption?.value} ${
      environmentalImpacts.energyConsumption?.unit
    } (${environmentalImpacts.energyConsumption?.rating})
    - Waste Generation: ${environmentalImpacts.wasteGeneration?.value} ${
      environmentalImpacts.wasteGeneration?.unit
    } (${environmentalImpacts.wasteGeneration?.rating})

    CIRCULARITY SCORE: ${circularFlowData?.circularityScore || "N/A"}%

    Please provide:
    1. **Environmental Assessment** (2-3 sentences): Overall environmental performance analysis
    2. **Key Strengths** (3-4 bullet points): What's being done well
    3. **Priority Improvements** (4-5 bullet points): Specific actionable recommendations with expected impact
    4. **Sustainability Rating** (scale 1-10 with justification)
    5. **Future Outlook** (2-3 sentences): Long-term sustainability considerations

    Format your response in clear sections with bullet points where appropriate. Be specific, actionable, and focus on concrete improvements that can reduce environmental impact.
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const aiInsights = response.text();

    return NextResponse.json({
      success: true,
      insights: aiInsights,
    });
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate AI insights",
        details: error.message,
        fallback:
          "AI insights are temporarily unavailable. Please try again later.",
      },
      { status: 500 }
    );
  }
}
