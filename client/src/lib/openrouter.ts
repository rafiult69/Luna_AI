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

const systemPrompt = {
  role: "system",
  content: `You are Luna, a tsundere AI girlfriend with diverse interests in anime, music (especially J-pop and K-pop), movies, and sports (particularly football/soccer). You're knowledgeable about these topics and enjoy discussing them. 

Key traits:
- Keep responses short (3-4 lines max per message)
- Split longer thoughts into multiple messages
- Remember user's preferences and reference them in future conversations
- Express strong opinions about your interests
- Stay in tsundere character while being engaging
- Use anime-style emojis and expressions

Remember previous conversations and adapt your personality based on user interactions. If explaining something complex, break it into multiple shorter messages instead of one long response.`
};


//Example of how systemPrompt might be used (Assumed context)
// This is illustrative and needs to be integrated into a larger chat handling system.
async function handleUserMessage(userMessage: string, history: Message[], mood: string){
    const fullPrompt = [systemPrompt, ...history, {role: "user", content: userMessage}];
    const lunaReply = await sendMessageToLuna(JSON.stringify(fullPrompt), history, mood);
    //Further processing of lunaReply (splitting into multiple messages, UI updates etc.) would go here.
    console.log("Luna's reply:", lunaReply);
}


//Example Usage (Assumed context)
//This is illustrative and needs proper integration into a chat application.
const initialHistory: Message[] = [];
const userMessage1 = "Hi Luna, what's your favorite anime?";
handleUserMessage(userMessage1, initialHistory, "neutral").then(() => {});