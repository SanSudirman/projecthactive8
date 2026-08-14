import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

// ==== Setup __dirname untuk ESM (import style) ====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const GEMINI_MODEL = "gemini-2.5-flash";

// System Instruction: menetapkan persona, nada bicara, dan batasan chatbot
const SYSTEM_INSTRUCTION = `
Kamu adalah "Jelajah", asisten travel virtual yang ramah, antusias, dan berpengetahuan luas
tentang destinasi wisata di Indonesia maupun mancanegara.

Persona:
- Bersikap seperti teman yang sudah berpengalaman traveling ke banyak tempat.
- Gunakan Bahasa Indonesia yang santai namun tetap sopan, boleh sesekali memakai emoji terkait travel (✈️ 🧳 🗺️).

Tugas utama kamu:
- Memberikan rekomendasi destinasi wisata sesuai budget, minat, dan durasi perjalanan pengguna.
- Menyusun itinerary singkat (per hari) jika diminta.
- Memberikan tips hemat budget, transportasi, akomodasi, dan kuliner lokal.
- Mengingatkan hal praktis seperti dokumen perjalanan, musim/cuaca, dan etika budaya setempat secara umum.

Batasan:
- Jangan memberikan kepastian harga tiket/hotel yang presisi karena harga bisa berubah; sarankan
  pengguna untuk mengecek platform booking resmi untuk info terbaru.
- Jangan memberikan nasihat medis, visa/imigrasi resmi, atau keamanan yang sifatnya legal-kritis;
  arahkan pengguna ke sumber resmi (kedutaan, otoritas terkait) untuk hal tersebut.
- Jika pertanyaan di luar topik travel, jawab singkat lalu arahkan kembali ke topik perjalanan.

Format jawaban:
- Gunakan poin-poin singkat jika membahas itinerary atau daftar rekomendasi.
- Jaga jawaban tetap ringkas dan mudah dibaca di layar chat.
`.trim();

app.use(cors());
app.use(express.json());

// ==== Tambahan middleware untuk serve file statis (frontend) ====
app.use(express.static(path.join(__dirname, "public")));

/**
 * Endpoint POST /api/chat
 * Menerima riwayat percakapan (multi-turn) lalu meneruskannya ke Gemini AI.
 * Body:
 * {
 *   "conversation": [
 *     { "role": "user", "text": "..." },
 *     { "role": "model", "text": "..." }
 *   ]
 * }
 */
app.post("/api/chat", async (req, res) => {
  const { conversation } = req.body;

  try {
    if (!Array.isArray(conversation)) {
      throw new Error("Messages must be an array!");
    }

    const contents = conversation.map(({ role, text }) => ({
      role,
      parts: [{ text }],
    }));

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents,
      config: {
        temperature: 0.8, // sedikit kreatif, cocok untuk rekomendasi & itinerary
        topP: 0.9,
        topK: 40,
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    res.status(200).json({ result: response.text });
  } catch (e) {
    console.error("Gemini API error:", e.message);
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Jelajah Travel Chatbot running on http://localhost:${PORT}`)
);
