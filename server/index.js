import "dotenv/config";
import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

const app = express();
const port = Number(process.env.PORT || 3001);
const model = process.env.GEMINI_MODEL || "gemini-3.8-flash";

app.use(cors());
app.use(express.json({ limit: "1mb" }));

const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  : null;

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, configured: Boolean(process.env.GEMINI_API_KEY), model });
});

app.post("/api/chat", async (req, res) => {
  try {
    if (!ai) {
      return res.status(500).json({
        error: "Gemini API key is not configured. Add GEMINI_API_KEY to server/.env."
      });
    }

    const messages = Array.isArray(req.body?.messages) ? req.body.messages : [];
    const contents = messages
      .filter(m => m && (m.role === "user" || m.role === "model") && typeof m.text === "string" && m.text.trim())
      .slice(-30)
      .map(m => ({ role: m.role, parts: [{ text: m.text.trim() }] }));

    if (!contents.length || contents.at(-1).role !== "user") {
      return res.status(400).json({ error: "A user message is required." });
    }

    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction: "You are a helpful, concise AI assistant. Answer clearly and accurately. Use markdown when useful."
      }
    });

    res.json({ text: response.text || "I couldn't generate a response." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.message || "Gemini request failed." });
  }
});

app.listen(port, () => {
  console.log(`Gemini chatbot server: http://localhost:${port}`);
});
