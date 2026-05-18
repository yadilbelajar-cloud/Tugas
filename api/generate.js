const { GoogleGenerativeAI } = require("@google/generative-ai");

export default async function handler(req, res) {
    // Hanya izinkan metode POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { prompt } = req.body;

    // Cek apakah API Key ada
    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: 'API Key belum dikonfigurasi di Vercel.' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const result = await model.generateContent(`
            Anda adalah pakar pemrograman. Berikan solusi kode yang lengkap, 
            penjelasan alur logika singkat, dan tips optimasi untuk permintaan berikut: 
            ${prompt}
        `);
        
        const response = await result.response;
        const text = response.text();

        // Kirim respon balik ke frontend
        return res.status(200).json({ text: text });
    } catch (error) {
        console.error("AI Error:", error);
        return res.status(500).json({ error: "Gagal memproses AI: " + error.message });
    }
}
