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
      
      // Create Luna's response message
      const lunaMessage: Message = {
        id: nanoid(),
        sender: 'luna',
        content: response,
        timestamp: new Date().toISOString()
      };
      
      // Add Luna's response to chat
      setMessages(prev => [...prev, lunaMessage]);
      
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
