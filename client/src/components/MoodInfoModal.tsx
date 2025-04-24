import { useEffect } from 'react';
import { getMoodEmoji, getMoodData } from '@/lib/constants';

interface MoodInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMood: string;
}

const MoodInfoModal: React.FC<MoodInfoModalProps> = ({ 
  isOpen, 
  onClose, 
  currentMood 
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const moodData = getMoodData(currentMood);
  const moodColor = currentMood === 'happy' ? 'bg-happy' : 
                    currentMood === 'angry' ? 'bg-angry' : 
                    currentMood === 'sad' ? 'bg-sad' : 
                    currentMood === 'embarrassed' ? 'bg-accent' : 'bg-neutral';

  return (
    <div className="fixed inset-0 bg-dark/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-20">
      <div className="bg-light/90 dark:bg-secondary/95 rounded-xl p-6 max-w-md w-11/12 shadow-lg glass-card slide-up">
        <div className="flex justify-between items-start mb-4">
          <h2 className="font-display font-bold text-xl text-dark dark:text-light">Luna's Current Mood</h2>
          <button onClick={onClose} className="text-dark/70 dark:text-light/70 hover:text-accent dark:hover:text-primary transition-all duration-300">
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="flex items-center justify-center my-6">
          <div className={`w-24 h-24 rounded-full ${moodColor} flex items-center justify-center text-4xl shadow-md hover:shadow-lg transition-all duration-300 animate-mood-change`}>
            <span className="transform hover:scale-110 transition-transform duration-300">{getMoodEmoji(currentMood)}</span>
          </div>
        </div>
        
        <div className="text-center mb-4">
          <h3 className="font-bold text-lg capitalize text-dark dark:text-light">{currentMood}</h3>
          <p className="text-dark/70 dark:text-light/70 font-body">{moodData.description}</p>
        </div>
        
        <div className="bg-secondary/20 dark:bg-primary/10 rounded-xl p-4 text-sm glass-effect">
          <p className="font-semibold mb-2 text-dark dark:text-light">How Luna's Mood Affects Conversation:</p>
          <ul className="list-disc list-inside space-y-2 text-dark/80 dark:text-light/80 font-body">
            {moodData.effects.map((effect, index) => (
              <li key={index} className="fade-in" style={{animationDelay: `${index * 100}ms`}}>{effect}</li>
            ))}
          </ul>
        </div>
        
        <button 
          onClick={onClose} 
          className="w-full mt-6 bg-accent hover:bg-accent/80 dark:bg-primary dark:hover:bg-primary/80 text-white py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 font-body transform hover:translate-y-[-2px] active:translate-y-[1px]"
        >
          Got it!
        </button>
      </div>
    </div>
  );
};

export default MoodInfoModal;
