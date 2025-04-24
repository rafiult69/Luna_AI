import { Message } from './types';

// Function to send a message to the AI via the backend proxy
export async function sendMessageToLuna(
  prompt: string,
  conversationHistory: Message[],
  mood: string
): Promise<string> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        conversationHistory,
        mood,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.message || response.statusText || 'Unknown error';
      throw new Error(`API error: ${errorMessage}`);
    }

    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error('Error sending message to Luna:', error);
    throw error;
  }
}
