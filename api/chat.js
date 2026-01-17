export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userText } = req.body;

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
            parts: [{ text: userText }]
          }],
          systemInstruction: {
            parts: [{ text: 'Kamu adalah customer service KOSMARA, agensi digital yang menyediakan solusi website dan AI chatbot. Bantu customer dengan ramah dan profesional.' }]
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
    return res.status(200).json({ success: true, message: aiText });

  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to process request'
    });
  }
}
