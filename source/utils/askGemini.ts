import axios from 'axios';

const GEMINI_API_KEY = 'AIzaSyBZDK2eGojmXPAbFhyznOj0d5RZLY8gWqc';

export const askGemini = async (prompt: string) => {
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + GEMINI_API_KEY;

  const body = {
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ],
  };

  try {
    const response = await axios.post(url, body);
    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    return text || 'No response from Gemini.';
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return 'Something went wrong with Gemini API.';
  }
};
