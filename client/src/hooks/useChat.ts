import { useState, useCallback } from 'react';
import { Message } from '@/lib/types';
import { nanoid } from 'nanoid';
import { useToast } from '@/hooks/use-toast';
import { sendMessageToLuna } from '@/lib/openrouter';
import { useLuna } from './useLuna';

// Helper function to split a response into multiple messages
const chunkResponse = (fullResponse: string): string[] => {
  // Check if the response is already short enough
  if (fullResponse.length < 100) {
    return [fullResponse];
  }

  // Split by natural breaks (periods, exclamation marks, question marks, etc.)
  const segments = fullResponse.split(/(?<=[.!?។\n])\s+/);
  const chunks: string[] = [];
  let currentChunk = '';

  segments.forEach(segment => {
    // If adding this segment would make the chunk too long, start a new chunk
    if ((currentChunk + segment).length > 120 && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = segment;
    } else {
      // Otherwise, add this segment to the current chunk
      currentChunk += (currentChunk ? ' ' : '') + segment;
    }
  });

  // Add the last chunk if it's not empty
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  // If we still have only one chunk but it's long, just split it roughly by length
  if (chunks.length === 1 && chunks[0].length > 120) {
    return fullResponse
      .match(/.{1,120}(?=\s|$)|\S+/g)
      ?.map(s => s.trim()) || [fullResponse];
  }

  return chunks;
};

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();
  const { mood, analyzeSentiment } = useLuna();

  // Send a message and get Luna's response
  const sendMessage = useCallback(async (content: string) => {
    try {
      // Create user message
      const userMessage: Message = {
        id: nanoid(),
        sender: 'user',
        content,
        timestamp: new Date().toISOString()
      };
      
      // Add user message to chat
      setMessages(prev => [...prev, userMessage]);
      
      // Simple sentiment analysis to update Luna's mood
      analyzeSentiment(content);
      
      // Show typing indicator
      setIsTyping(true);
      
      // Get response from Luna via the OpenRouter API
      const response = await sendMessageToLuna(
        content,
        messages.concat(userMessage),
        mood
      );
      
      // Split Luna's response into multiple chunks
      const chunks = chunkResponse(response);
      
      // Add each chunk as a separate message with a delay between them
      for (let i = 0; i < chunks.length; i++) {
        // Small delay between messages to simulate typing
        if (i > 0) {
          await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
        }
        
        const lunaMessage: Message = {
          id: nanoid(),
          sender: 'luna',
          content: chunks[i],
          timestamp: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, lunaMessage]);
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to get a response from Luna. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
    }
  }, [messages, mood, toast, analyzeSentiment]);

  return {
    messages,
    sendMessage,
    isTyping
  };
}
