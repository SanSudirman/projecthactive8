import "dotenv/config";
import express from "express";
import multer from "multer";
import { GoogleGenAI } from "@google/genai";

const app = express();
const upload = multer();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const GEMINI_MODEL = "gemini-3.5-flash-lite";

app.use(express.json());

// Test server
app.get("/", (req, res) => {
  res.json({
    message: "Hactive8 Gemini API berjalan",
  });
});

// Generate text
app.post("/generate-text", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({
        message: "Prompt tidak boleh kosong",
      });
    }

    console.log("Prompt:", prompt);

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
    });

    res.status(200).json({
      result: response.text,
    });
  } catch (e) {
    console.error("Gemini Error:", e);

    res.status(500).json({
      message: e.message,
    });
  }
});

// Start server
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server ready on http://localhost:${PORT}`);
});

app.post("/generate-from-image", upload.single("image"), async (req, res) => {
  const { prompt } = req.body;

  // Cek apakah file gambar dikirim
  if (!req.file) {
    return res.status(400).json({
      message: "File gambar wajib diupload",
    });
  }

  // Ubah gambar menjadi Base64
  const base64Image = req.file.buffer.toString("base64");

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        {
          text: prompt,
          type: "text",
        },
        {
          inlineData: {
            data: base64Image,
            mimeType: req.file.mimetype,
          },
        },
      ],
    });

    res.status(200).json({
      result: response.text,
    });
  } catch (e) {
    console.error(e);

    res.status(500).json({
      message: e.message,
    });
  }
});

app.post(
  "/generate-from-document",
  upload.single("document"),
  async (req, res) => {
    const { prompt } = req.body;

    // Cek apakah dokumen diupload
    if (!req.file) {
      return res.status(400).json({
        message: "File dokumen wajib diupload",
      });
    }

    // Convert dokumen ke Base64
    const base64Document = req.file.buffer.toString("base64");

    try {
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,

        contents: [
          {
            text: prompt ?? "Tolong buat ringkasan dari dokumen berikut.",
            type: "text",
          },
          {
            inlineData: {
              data: base64Document,
              mimeType: req.file.mimetype,
            },
          },
        ],
      });

      res.status(200).json({
        result: response.text,
      });
    } catch (e) {
      console.error("Gemini Error:", e);

      res.status(500).json({
        message: e.message,
      });
    }
  },
);

app.post("/generate-from-audio", upload.single("audio"), async (req, res) => {
  const { prompt } = req.body;

  // Cek apakah file audio diupload
  if (!req.file) {
    return res.status(400).json({
      message: "File audio wajib diupload",
    });
  }

  // Convert audio ke Base64
  const base64Audio = req.file.buffer.toString("base64");

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,

      contents: [
        {
          text: prompt ?? "Tolong buatkan transkrip dari rekaman berikut.",
          type: "text",
        },
        {
          inlineData: {
            data: base64Audio,
            mimeType: req.file.mimetype,
          },
        },
      ],
    });

    res.status(200).json({
      result: response.text,
    });
  } catch (e) {
    console.error("Gemini Error:", e);

    res.status(500).json({
      message: e.message,
    });
  }
});
