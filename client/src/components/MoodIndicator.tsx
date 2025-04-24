import { useState, useEffect } from 'react';
import { getMoodEmoji } from '@/lib/constants';

interface MoodIndicatorProps {
  mood: string;
}

const MoodIndicator: React.FC<MoodIndicatorProps> = ({ mood }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [previousMood, setPreviousMood] = useState(mood);

  useEffect(() => {
    if (mood !== previousMood) {
      setIsAnimating(true);
      
      // Remove animation class after animation completes
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 500);
      
      setPreviousMood(mood);
      
      return () => clearTimeout(timer);
    }
  }, [mood, previousMood]);

  const getMoodColor = () => {
    switch (mood) {
      case 'happy':
        return 'bg-happy';
      case 'angry':
        return 'bg-angry';
      case 'sad':
        return 'bg-sad';
      case 'embarrassed':
        return 'bg-accent';
      default:
        return 'bg-neutral';
    }
  };

  return (
    <div 
      className={`mood-indicator absolute -bottom-1 -right-1 w-6 h-6 rounded-full ${getMoodColor()} flex items-center justify-center text-xs shadow-md border-2 border-light ${isAnimating ? 'animate-mood-change' : ''}`}
      data-mood={mood}
    >
      <span className="mood-emoji">{getMoodEmoji(mood)}</span>
    </div>
  );
};

export default MoodIndicator;
