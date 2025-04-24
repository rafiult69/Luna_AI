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
    <div className="bg-light/80 rounded-xl p-4 shadow-md">
      <div className="flex items-center space-x-2">
        {/* Mood Info Button */}
        <button 
          className="p-2 text-dark rounded-full hover:bg-secondary/30 transition flex-shrink-0" 
          onClick={onOpenMoodInfo}
          aria-label="Current Mood"
        >
          <i className="fas fa-heart"></i>
        </button>
        
        {/* Text Input */}
        <div className="relative flex-grow">
          <textarea 
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="w-full px-4 py-2 rounded-xl border border-secondary focus:outline-none focus:ring-2 focus:ring-accent resize-none h-12 max-h-32"
            placeholder="Type your message..."
            disabled={disabled}
          />
          
          {/* Emoji Picker Toggle */}
          <button 
            className="absolute right-3 bottom-3 text-dark/50 hover:text-accent transition" 
            onClick={toggleEmojiPicker}
            aria-label="Open emoji picker"
          >
            <i className="far fa-smile"></i>
          </button>
        </div>
        
        {/* Send Button */}
        <button 
          onClick={handleSendMessage}
          className="bg-accent hover:bg-accent/80 text-white p-3 rounded-full shadow-md transition flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!message.trim() || disabled}
        >
          <i className="fas fa-paper-plane"></i>
        </button>
      </div>
      
      {/* Emoji Picker */}
      <div className={`emoji-picker bg-light rounded-xl mt-2 p-2 shadow-md ${isEmojiOpen ? 'open' : ''}`}>
        <div className="grid grid-cols-8 gap-2">
          {emojiList.map((emoji, index) => (
            <button 
              key={index}
              className="emoji-btn text-xl hover:bg-secondary/30 p-1 rounded transition"
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
