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
    <div className="fixed inset-0 bg-dark/50 flex items-center justify-center z-20">
      <div className="bg-light rounded-xl p-6 max-w-md w-11/12 shadow-lg">
        <div className="flex justify-between items-start mb-4">
          <h2 className="font-display font-bold text-xl">Luna's Current Mood</h2>
          <button onClick={onClose} className="text-dark hover:text-accent">
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="flex items-center justify-center my-6">
          <div className={`w-24 h-24 rounded-full ${moodColor} flex items-center justify-center text-4xl shadow-md`}>
            <span>{getMoodEmoji(currentMood)}</span>
          </div>
        </div>
        
        <div className="text-center mb-4">
          <h3 className="font-bold text-lg capitalize">{currentMood}</h3>
          <p className="text-dark/70">{moodData.description}</p>
        </div>
        
        <div className="bg-secondary/20 rounded-xl p-3 text-sm">
          <p className="font-semibold mb-2">How Luna's Mood Affects Conversation:</p>
          <ul className="list-disc list-inside space-y-1 text-dark/80">
            {moodData.effects.map((effect, index) => (
              <li key={index}>{effect}</li>
            ))}
          </ul>
        </div>
        
        <button 
          onClick={onClose} 
          className="w-full mt-6 bg-accent hover:bg-accent/80 text-white py-2 rounded-xl shadow transition"
        >
          Got it!
        </button>
      </div>
    </div>
  );
};

export default MoodInfoModal;
