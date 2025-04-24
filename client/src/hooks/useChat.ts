import { useState, useCallback } from 'react';
import { Message } from '@/lib/types';
import { nanoid } from 'nanoid';
import { useToast } from '@/hooks/use-toast';
import { sendMessageToLuna } from '@/lib/openrouter';
import { useLuna } from './useLuna';

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
      
      // Split long responses into multiple messages
      const responses = response.split('\n\n').filter(r => r.trim());
      
      // Send each part as a separate message with a small delay
      for (const responsePart of responses) {
        const lunaMessage: Message = {
          id: nanoid(),
          sender: 'luna',
          content: responsePart.trim(),
          timestamp: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, lunaMessage]);
        
        // Add small delay between multiple messages
        if (responses.length > 1) {
          await new Promise(resolve => setTimeout(resolve, 800));
        }
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
