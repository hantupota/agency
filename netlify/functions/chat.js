const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };
  
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }
  
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({error: 'Method not allowed'})
    };
  }
  
  try {
    const {userMessage, userData, systemPrompt} = JSON.parse(event.body);
    
    if (!userMessage || !userData) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({error: 'Missing required fields'})
      };
    }
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          contents: [{
            role: "user",
            parts: [{text: `User: ${userData.name} (${userData.business})\nPesan: ${userMessage}`}]
          }],
          systemInstruction: {
            parts: [{text: systemPrompt || ''}]
          },
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 300
          }
        })
      }
    );
    
    const data = await response.json();
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        response: data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response'
      })
    };
    
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({success: false, error: 'Server error'})
    };
  }
};
