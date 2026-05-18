const { GoogleGenerativeAI } = require("@google/generative-ai");

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { prompt } = req.body;

    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: 'API Key belum dikonfigurasi di Vercel.' });
    }

    // Menginisialisasi dengan apiVersion 'v1' untuk menghindari error 404 pada v1beta
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    try {
        // Mengambil model secara eksplisit dari API v1
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash"
        }, { apiVersion: 'v1' }); 

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return res.status(200).json({ text: text });
    } catch (error) {
        console.error("Detail Error:", error);
        
        // Memberikan pesan yang lebih spesifik jika terjadi error lagi
        return res.status(500).json({ 
            error: `Detail Error: ${error.message}` 
        });
    }
}
