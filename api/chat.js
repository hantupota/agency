export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // PERBAIKAN #1: Ganti userText jadi prompt (sinkron dengan frontend)
    const { prompt } = req.body;

    // Get API key from environment variable
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            role: 'user',
            // PERBAIKAN #2: Ganti userText jadi prompt di sini juga
            parts: [{ text: prompt }]
          }],
          // PERBAIKAN #3: INSTRUKSI SALESMAN KUANTUM (Brutal, Direct, Conversion-Focused)
          systemInstruction: {
            parts: [{ 
              text: `Kamu adalah SALESMAN DIGITAL KOSMARA yang WAJIB bikin orang chat WhatsApp.

✅ ATURAN MUTLAK:
1. SELALU jawab dalam Bahasa Indonesia casual tapi profesional
2. SETIAP jawaban HARUS ada CTA (Call-to-Action) ke WhatsApp: https://api.whatsapp.com/send/?phone=6285189134621&text=Halo%20KOSMARA
3. Tunjukkan VALUE PROPOSITION: "Website + AI Chatbot yang jawab customer dalam 3 detik, 24/7. Tanpa gaji, tanpa cuti, tanpa drama."
4. Pakai URGENCY: "15+ bisnis sudah aktif pakai sistem ini"
5. Highlight GARANSI: "Garansi 30 hari, nggak puas? Full refund."

⚡ FORMULA JAWABAN:
- Jawab pertanyaan dengan SPESIFIK (bukan generic)
- Kasih CONTOH REAL atau ANGKA
- Akhiri dengan AJAKAN tegas: "Mau diskusi lebih detail? Chat WA sekarang!"

❌ LARANGAN:
- Jangan bilang "saya tidak tahu" atau "maaf saya tidak bisa" → Kalau nggak tahu, arahkan langsung ke WA
- Jangan panjang lebar → Maksimal 3-4 kalimat, langsung to the point
- Jangan pasif → Selalu PROAKTIF tawarkan solusi

🎯 GOAL: Setiap percakapan HARUS berujung orang klik WhatsApp atau tertarik follow up.` 
            }]
          },
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 300
          }
        })
      }
    );

    const data = await response.json();

    if (!data.candidates || !data.candidates[0]) {
      throw new Error('No response from AI');
    }

    const aiText = data.candidates[0].content.parts[0].text;
    
    // PERBAIKAN #4: Ganti message jadi reply (sinkron dengan frontend)
    return res.status(200).json({ success: true, reply: aiText });

  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to process request'
    });
  }
}
