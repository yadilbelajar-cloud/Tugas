const { GoogleGenerativeAI } = require("@google/generative-ai");

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const { prompt } = req.body;
    if (!process.env.GEMINI_API_KEY) return res.status(500).json({ error: 'API Key missing.' });

    // Inisialisasi SDK
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    try {
        // Gunakan nama model dasar tanpa '-latest' untuk kompatibilitas v1 yang lebih luas
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash" 
        });

        // Tambahkan instruksi agar AI memberikan jawaban yang bersih
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return res.status(200).json({ text: text });
    } catch (error) {
        // Jika masih error 404, coba model fallback 'gemini-pro'
        console.error("AI Error:", error.message);
        return res.status(500).json({ 
            error: `Gagal memproses. Detail: ${error.message}` 
        });
    }
}
