# Jelajah — Travel Assistant Chatbot (Gemini AI)

Chatbot travel assistant berbasis web yang mensimulasikan percakapan dengan pengguna
menggunakan **Google Gemini 2.5 Flash**, dibangun sesuai alur materi Sesi 3 Hacktiv8
("Pembuatan Chatbot berbasis Gemini AI Model"): frontend **Vanilla JS** + backend
**Node.js/Express**, terhubung lewat endpoint `POST /api/chat`.

## Use Case
- **Persona:** "Jelajah", asisten travel yang ramah dan santai.
- **Fungsi:** rekomendasi destinasi, itinerary singkat per hari, tips budget/transportasi/kuliner.
- **Parameter kreatif:** `temperature: 0.8`, `topP: 0.9`, `topK: 40` — cukup kreatif untuk
  brainstorming itinerary tapi tetap relevan.
- **System Instruction:** menetapkan persona, batasan (tidak memberi harga pasti/nasihat
  medis/visa resmi), dan format jawaban ringkas berpoin.

## Struktur File
```
gemini-travel-chatbot/
├── .env.example      # Contoh environment variable (salin jadi .env)
├── .gitignore
├── index.js           # Backend Express + Gemini AI
├── package.json
└── public/
    ├── index.html      # UI chatbot (tema boarding pass)
    ├── style.css
    └── script.js       # Logika fetch ke /api/chat
```

## Cara Menjalankan

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Siapkan API key Gemini**
   - Salin `.env.example` menjadi `.env`
   - Isi `GEMINI_API_KEY` dengan API key kamu dari https://aistudio.google.com/app/apikey

3. **Jalankan server**
   ```bash
   npm start
   ```

4. **Buka di browser**
   ```
   http://localhost:3000
   ```

## Uji Coba API (opsional, via Postman/curl)
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"conversation":[{"role":"user","text":"Rekomendasikan itinerary 3 hari di Bali dengan budget hemat"}]}'
```

## Deliverables (sesuai instruksi materi)
- URL repositori GitHub project ini
- Screenshot User Interface chatbot
