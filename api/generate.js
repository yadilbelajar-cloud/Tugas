// Simpan file ini di folder bernama 'api'
const { GoogleGenerativeAI } = require("@google/generative-ai");

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { prompt } = req.body;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(`Anda adalah asisten ahli pemrograman. Berikan penjelasan terstruktur dan kode yang benar untuk: ${prompt}`);
        const response = await result.response;
        
        res.status(200).json({ text: response.text() });
    } catch (error) {
        res.status(500).json({ error: "Gagal memproses AI" });
    }
}
