const { GoogleGenerativeAI } = require("@google/generative-ai");

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { prompt } = req.body;

    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: 'API Key belum dikonfigurasi di Vercel.' });
    }

    // Inisialisasi API dengan versi yang lebih stabil
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    try {
        // Menggunakan model spesifik: gemini-1.5-flash
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash"
        });
        
        const fullPrompt = `Tugas Pemrograman: ${prompt}\n\nBerikan kode yang benar, penjelasan singkat, dan tips.`;

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();

        if (!text) {
            throw new Error("AI memberikan respon kosong.");
        }

        return res.status(200).json({ text: text });
    } catch (error) {
        console.error("AI Error Detail:", error);
        
        // Memberikan pesan error yang lebih informatif jika model tidak ditemukan
        return res.status(500).json({ 
            error: "Gagal memproses AI. Pastikan API Key benar dan model tersedia." 
        });
    }
}
