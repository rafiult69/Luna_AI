import { useRef, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { Message } from "@/lib/types";

interface ChatWindowProps {
  messages: Message[];
  isTyping: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isTyping }) => {
  const chatHistoryRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <main className="flex-grow overflow-y-auto bg-light/80 dark:bg-secondary/10 rounded-xl p-4 shadow-md mb-2 relative glass-card">
      <div ref={chatHistoryRef} id="chat-history" className="space-y-4 scroll-smooth">
        {/* Welcome message when no messages */}
        {messages.length === 0 && (
          <div className="bg-primary/20 dark:bg-primary/10 rounded-xl p-4 text-center text-sm glass-effect slide-up">
            <p className="font-body">Luna is online now. Say hello to start a conversation! (´｡• ᵕ •｡`)</p>
          </div>
        )}
        
        {/* Messages */}
        {messages.map((message, index) => {
          const time = new Date(message.timestamp);
          const formattedTime = time.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          });
          
          if (message.sender === "luna") {
            return (
              <div key={message.id} className="flex items-end mb-4 fade-in">
                <div className="relative flex-shrink-0 mr-2">
                  <div className="w-9 h-9 rounded-full bg-light dark:bg-secondary border-2 border-accent overflow-hidden shadow-md">
                    <img 
                      src="https://images.unsplash.com/photo-1578632767115-351597cf2477?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" 
                      alt="Luna small" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="max-w-[80%]">
                  <div className="chat-bubble-luna bg-secondary dark:bg-primary/20 p-3 shadow-md">
                    <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>
                  <div className="text-xs text-dark/50 dark:text-light/50 mt-1 ml-2">
                    {formattedTime}
                  </div>
                </div>
              </div>
            );
          } else {
            return (
              <div key={message.id} className="flex flex-row-reverse items-end mb-4 fade-in">
                <div className="w-9 h-9 rounded-full bg-accent dark:bg-accent/90 ml-2 flex items-center justify-center text-light font-bold overflow-hidden shadow-md">
                  <span>ME</span>
                </div>
                <div className="max-w-[80%]">
                  <div className="chat-bubble-user bg-accent dark:bg-accent/90 p-3 text-light shadow-md">
                    <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>
                  <div className="text-xs text-dark/50 dark:text-light/50 mt-1 mr-2 text-right">
                    {formattedTime}
                  </div>
                </div>
              </div>
            );
          }
        })}
        
        {/* System message for mood changes can go here */}
        {/* This would be added to the messages array in a real app */}
        
        {/* Luna typing indicator */}
        {isTyping && (
          <div className="flex items-end mb-4 fade-in">
            <div className="relative flex-shrink-0 mr-2">
              <div className="w-9 h-9 rounded-full bg-light dark:bg-secondary border-2 border-accent overflow-hidden shadow-md">
                <img 
                  src="https://images.unsplash.com/photo-1578632767115-351597cf2477?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" 
                  alt="Luna small" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="max-w-[80%]">
              <div className="chat-bubble-luna bg-secondary dark:bg-primary/20 p-3 shadow-md">
                <p className="loading-dots">Luna is typing</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default ChatWindow;
