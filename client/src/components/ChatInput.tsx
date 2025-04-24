import { useState, useRef, ChangeEvent, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onOpenMoodInfo: () => void;
  disabled?: boolean;
}

// Common emojis for anime chat
const emojiList = [
  "😊", "❤️", "😂", "👍", "😍", "🥺", "😭", "🙏",
  "✨", "🔥", "🥰", "😘", "💕", "😡", "😤", "😳"
];

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  onOpenMoodInfo, 
  disabled = false 
}) => {
  const [message, setMessage] = useState("");
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto resize the textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleSendMessage = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage("");
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleEmojiPicker = () => {
    setIsEmojiOpen(!isEmojiOpen);
  };

  const addEmoji = (emoji: string) => {
    setMessage(prev => prev + emoji);
    setIsEmojiOpen(false);
    textareaRef.current?.focus();
  };

  return (
    <div className="bg-light/80 dark:bg-secondary/10 rounded-xl p-4 shadow-md glass-card">
      <div className="flex items-center space-x-2">
        {/* Mood Info Button */}
        <button 
          className="p-2 text-dark dark:text-light rounded-full hover:bg-secondary/30 dark:hover:bg-primary/30 transition-all duration-300 flex-shrink-0 hover:shadow-md" 
          onClick={onOpenMoodInfo}
          aria-label="Current Mood"
        >
          <i className="fas fa-heart text-accent dark:text-accent/90"></i>
        </button>
        
        {/* Text Input */}
        <div className="relative flex-grow">
          <textarea 
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="w-full px-4 py-2 rounded-xl border border-secondary dark:border-primary/20 focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-primary resize-none h-12 max-h-32 transition-all duration-300 hover:border-accent/50 dark:hover:border-primary/50 backdrop-blur-sm bg-white/70 dark:bg-secondary/20 font-body"
            placeholder="Type your message..."
            disabled={disabled}
          />
          
          {/* Emoji Picker Toggle */}
          <button 
            className="absolute right-3 bottom-3 text-dark/50 dark:text-light/50 hover:text-accent dark:hover:text-primary transition-all duration-300" 
            onClick={toggleEmojiPicker}
            aria-label="Open emoji picker"
          >
            <i className="far fa-smile"></i>
          </button>
        </div>
        
        {/* Send Button */}
        <button 
          onClick={handleSendMessage}
          className="bg-accent hover:bg-accent/80 dark:bg-primary dark:hover:bg-primary/80 text-white p-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
          disabled={!message.trim() || disabled}
        >
          <i className="fas fa-paper-plane"></i>
        </button>
      </div>
      
      {/* Emoji Picker */}
      <div className={`emoji-picker bg-light/90 dark:bg-secondary/30 rounded-xl mt-2 p-2 shadow-md glass-effect ${isEmojiOpen ? 'open' : ''}`}>
        <div className="grid grid-cols-8 gap-2">
          {emojiList.map((emoji, index) => (
            <button 
              key={index}
              className="emoji-btn text-xl hover:bg-secondary/40 dark:hover:bg-primary/20 p-1 rounded-lg transition-all duration-200 hover:shadow-sm transform hover:scale-110"
              onClick={() => addEmoji(emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
