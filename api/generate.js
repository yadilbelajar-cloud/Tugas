const { GoogleGenerativeAI } = require("@google/generative-ai");

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(req.body.prompt);
        const response = await result.response;
        const text = response.text();

        // PASTIKAN MENGIRIM OBJEK SEPERTI INI
        res.status(200).json({ text: text }); 
    } catch (error) {
        res.status(500).json({ text: "Gagal memproses AI: " + error.message });
    }
}
