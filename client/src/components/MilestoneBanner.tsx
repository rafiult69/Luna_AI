import { useEffect } from 'react';
import { Milestone } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';

interface MilestoneBannerProps {
  milestone: Milestone;
  onClose: () => void;
}

const MilestoneBanner: React.FC<MilestoneBannerProps> = ({ milestone, onClose }) => {
  // Auto close after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-accent to-purple-400 text-white px-6 py-4 rounded-xl shadow-lg z-20 max-w-sm w-5/6"
      >
        <div className="flex items-center">
          <div className="mr-4 text-2xl">🎉</div>
          <div className="flex-grow">
            <h3 className="font-bold">New Relationship Milestone!</h3>
            <p className="text-sm">{milestone.description}</p>
          </div>
          <button onClick={onClose} className="ml-2 hover:text-dark/50">
            <i className="fas fa-times"></i>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MilestoneBanner;
