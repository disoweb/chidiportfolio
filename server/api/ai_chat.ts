// server/api/ai_chat.ts

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import type { NextApiRequest, NextApiResponse } from 'next';

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is not set.");
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash", // Or any other suitable model
});

// Configuration for content generation safety settings
const generationConfig = {
  temperature: 0.9,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

/**
 * This is a Next.js API route handler.
 *
 * @param req The request object, containing the message from the user.
 * @param res The response object, used to stream the response back.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history: [
        {
          role: "user",
          parts: [{ text: "You are a helpful AI assistant named Chidi, embedded in a web developer's portfolio website. Your purpose is to answer questions about the developer's skills, projects, and experience. Be friendly, professional, and helpful. The developer's name is Chidi, and he specializes in high-performance applications. You can and should encourage users to navigate the portfolio by providing markdown links like [See Projects](#projects)." }],
        },
        {
          role: "model",
          parts: [{ text: "Great! I'm ready to assist. I will act as Chidi's AI assistant and help visitors learn more about his work." }],
        },
      ],
    });

    const result = await chat.sendMessageStream(message);

    // Set headers for streaming
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    // Stream the response
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      // Write each chunk to the response stream
      res.write(chunkText);
    }

    // End the response stream
    res.end();

  } catch (error) {
    console.error("Error in AI chat handler:", error);
    res.status(500).json({ error: "Failed to get a response from the AI." });
  }
}