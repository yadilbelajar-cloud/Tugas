const { GoogleGenerativeAI } = require("@google/generative-ai");

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { prompt } = req.body;

    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: 'API Key tidak ditemukan di Environment Variables Vercel.' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    try {
        // Coba gunakan nama model tanpa titik (beberapa versi API lebih stabil dengan format ini)
        // Jika 'gemini-1.5-flash' gagal, coba ganti ke 'gemini-pro' untuk memastikan koneksi dasar
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash-latest" 
        });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return res.status(200).json({ text: text });
    } catch (error) {
        console.error("DEBUG ERROR:", error);
        return res.status(500).json({ 
            error: `Detail Error: ${error.message}` 
        });
    }
}
