import { useEffect, useRef } from 'react';

interface MenuDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const MenuDropdown: React.FC<MenuDropdownProps> = ({ isOpen, onClose }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-4 top-20 bg-light/90 dark:bg-secondary/90 rounded-xl shadow-xl z-10 w-52 overflow-hidden glass-effect slide-up"
    >
      <div className="py-2">
        <a href="#" className="block px-4 py-3 text-dark dark:text-light hover:bg-primary/20 dark:hover:bg-primary/30 transition-all duration-200 font-body flex items-center">
          <i className="fas fa-book-open mr-3 text-primary dark:text-primary/90"></i> Conversation History
        </a>
        <a href="#" className="block px-4 py-3 text-dark dark:text-light hover:bg-primary/20 dark:hover:bg-primary/30 transition-all duration-200 font-body flex items-center">
          <i className="fas fa-heart mr-3 text-accent dark:text-accent/90"></i> Relationship Milestones
        </a>
        <a href="#" className="block px-4 py-3 text-dark dark:text-light hover:bg-primary/20 dark:hover:bg-primary/30 transition-all duration-200 font-body flex items-center">
          <i className="fas fa-cog mr-3 text-primary dark:text-primary/90"></i> Settings
        </a>
        <a href="#" className="block px-4 py-3 text-dark dark:text-light hover:bg-primary/20 dark:hover:bg-primary/30 transition-all duration-200 font-body flex items-center">
          <i className="fas fa-question-circle mr-3 text-primary dark:text-primary/90"></i> Help
        </a>
        <div className="border-t border-secondary/30 dark:border-primary/20 mt-1 pt-1">
          <a href="#" className="block px-4 py-3 text-dark dark:text-light hover:bg-primary/20 dark:hover:bg-primary/30 transition-all duration-200 font-body flex items-center">
            <i className="fas fa-moon mr-3 text-primary dark:text-primary/90"></i> Toggle Theme
          </a>
        </div>
      </div>
    </div>
  );
};

export default MenuDropdown;
