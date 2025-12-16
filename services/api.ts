import { ChatRequest, ChatResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL;

export const sendMessageToBackend = async (data: ChatRequest): Promise<ChatResponse> => {
  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();

  } catch (error) {
    console.error("API Error:", error);
    return {
      answer: "দুঃখিত, সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি। দয়া করে কিছুক্ষণ পর আবার চেষ্টা করুন।",
    };
  }
};
