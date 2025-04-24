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
      className="absolute right-4 top-20 bg-light rounded-xl shadow-xl z-10 w-48 overflow-hidden"
    >
      <div className="py-2">
        <a href="#" className="block px-4 py-2 hover:bg-primary/30 transition">
          <i className="fas fa-book-open mr-2"></i> Conversation History
        </a>
        <a href="#" className="block px-4 py-2 hover:bg-primary/30 transition">
          <i className="fas fa-heart mr-2"></i> Relationship Milestones
        </a>
        <a href="#" className="block px-4 py-2 hover:bg-primary/30 transition">
          <i className="fas fa-cog mr-2"></i> Settings
        </a>
        <a href="#" className="block px-4 py-2 hover:bg-primary/30 transition">
          <i className="fas fa-question-circle mr-2"></i> Help
        </a>
      </div>
    </div>
  );
};

export default MenuDropdown;
