export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Gunakan POST' });

    try {
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        const { userText, context } = req.body;

        const systemInstruction = `
            Identitas: AI Sales Specialist KOSMARA (Website & AI Agency).
            Tone: Casual-Profesional, ramah, persuasif.
            Tugas: Edukasi UMKM pentingnya web & AI chatbot.
            Wajib: Arahkan ke link WA [https://api.whatsapp.com/send/?phone=6285189134621](https://api.whatsapp.com/send/?phone=6285189134621)
        `;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ role: 'user', parts: [{ text: userText }] }],
                    systemInstruction: { parts: [{ text: systemInstruction }] },
                    generationConfig: { temperature: 0.8, maxOutputTokens: 500 }
                })
            }
        );

        const data = await response.json();
        
        if (data.candidates && data.candidates[0]) {
            const aiText = data.candidates[0].content.parts[0].text;
            return res.status(200).json({ success: true, message: aiText });
        } else {
            throw new Error('Gagal ambil respon AI');
        }

    } catch (e) {
        return res.status(500).json({ success: false, error: 'Koneksi AI Putus' });
    }
}
