import { useState, useEffect } from 'react';
import { Milestone } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export function useLuna() {
  const [mood, setMood] = useState<string>('neutral');
  const [affection, setAffection] = useState<number>(35); // Start at 35% as in the design
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  
  const { toast } = useToast();

  // Function to update mood
  const changeMood = (newMood: string) => {
    if (newMood !== mood) {
      setMood(newMood);
      
      // Optional: Add a system message about mood change
      toast({
        description: `Luna's mood has changed to: ${newMood.charAt(0).toUpperCase() + newMood.slice(1)} ✨`,
        duration: 3000,
      });
    }
  };

  // Function to increase affection
  const increaseAffection = (amount: number) => {
    setAffection(prev => Math.min(prev + amount, 100));
  };

  // Function to decrease affection
  const decreaseAffection = (amount: number) => {
    setAffection(prev => Math.max(prev - amount, 0));
  };

  // Function to add milestone
  const achieveMilestone = (milestone: Milestone) => {
    // Check if milestone already exists
    if (!milestones.some(m => m.id === milestone.id)) {
      setMilestones(prev => [...prev, milestone]);
      
      toast({
        title: "New Milestone Achieved!",
        description: milestone.description,
        duration: 5000,
      });
    }
  };

  // Function to analyze message and update mood
  const analyzeSentiment = (message: string) => {
    // Very simplified sentiment analysis - in a real app, use NLP or AI
    const lowerMsg = message.toLowerCase();
    
    if (lowerMsg.includes('love') || lowerMsg.includes('like') || lowerMsg.includes('cute')) {
      changeMood('happy');
      increaseAffection(5);
    } else if (lowerMsg.includes('sorry') || lowerMsg.includes('sad')) {
      changeMood('sad');
    } else if (lowerMsg.includes('angry') || lowerMsg.includes('hate') || lowerMsg.includes('stupid')) {
      changeMood('angry');
      decreaseAffection(5);
    } else if (lowerMsg.includes('beautiful') || lowerMsg.includes('pretty') || lowerMsg.includes('gorgeous')) {
      changeMood('embarrassed');
      increaseAffection(3);
    }
  };

  return {
    mood,
    affection,
    milestones,
    setMood: changeMood,
    increaseAffection,
    decreaseAffection,
    achieveMilestone,
    analyzeSentiment
  };
}
