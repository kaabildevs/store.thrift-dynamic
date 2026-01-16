import { GoogleGenAI } from "@google/genai";
import { Product } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getStylingAdvice = async (product: Product): Promise<string> => {
  try {
    const prompt = `
      You are a high-end avant-garde fashion stylist for a brutalist streetwear brand called "Kaabil KapdeWala".
      The user is looking at this product: ${product.name}.
      Description: ${product.description}
      Tags: ${product.tags.join(', ')}

      Provide a short, punchy, and edgy styling tip (max 3 sentences).
      Suggest what to pair it with (shoes, accessories, bottoms) to create a cohesive "archive fashion" look.
      Do not be overly enthusiastic. Be cool, minimal, and authoritative.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Pair with confidence and heavy boots.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Style this piece with raw denim and chunky leather boots for an effortless industrial look.";
  }
};
