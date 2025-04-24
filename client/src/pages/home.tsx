import { useState, useEffect } from "react";
import { MainLayout } from "@/components/Layouts";
import ChatWindow from "@/components/ChatWindow";
import ChatInput from "@/components/ChatInput";
import MoodIndicator from "@/components/MoodIndicator";
import RelationshipBar from "@/components/RelationshipBar";
import MenuDropdown from "@/components/MenuDropdown";
import MoodInfoModal from "@/components/MoodInfoModal";
import MilestoneBanner from "@/components/MilestoneBanner";
import { useChat } from "@/hooks/useChat";
import { useLuna } from "@/hooks/useLuna";
import { Message, Milestone } from "@/lib/types";
import { getAffectionLevel } from "@/lib/constants";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMoodModalOpen, setIsMoodModalOpen] = useState(false);
  const [activeMilestone, setActiveMilestone] = useState<Milestone | null>(null);

  const { 
    messages, 
    sendMessage, 
    isTyping 
  } = useChat();

  const {
    mood,
    affection,
    milestones,
    setMood,
    increaseAffection,
    achieveMilestone
  } = useLuna();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleMoodModal = () => {
    setIsMoodModalOpen(!isMoodModalOpen);
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    await sendMessage(content);
    
    // Simple increase in affection for demonstration purposes
    // In a real app, this would be more sophisticated
    if (content.toLowerCase().includes("like") || content.toLowerCase().includes("love")) {
      increaseAffection(10);
      
      // Check for milestone achievement
      if (affection >= 60 && !milestones.find(m => m.id === "friend")) {
        const newMilestone: Milestone = {
          id: "friend",
          title: "Friends",
          description: "You and Luna have reached the 'Friends' stage",
          timestamp: new Date().toISOString(),
          achieved: true
        };
        
        achieveMilestone(newMilestone);
        setActiveMilestone(newMilestone);
        
        // Update mood based on affection increase
        setMood("happy");
      }
    }
  };

  const closeMilestoneBanner = () => {
    setActiveMilestone(null);
  };

  const affectionLevel = getAffectionLevel(affection);

  return (
    <MainLayout>
      <div className="container mx-auto max-w-4xl p-2 md:p-4 flex flex-col h-screen">
        {/* Header */}
        <header className="bg-gradient-to-r from-primary to-secondary rounded-xl p-3 shadow-md mb-2 flex justify-between items-center">
          <div className="flex items-center">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-light border-2 border-accent overflow-hidden shadow-md">
                <img 
                  src="https://images.unsplash.com/photo-1578632767115-351597cf2477?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" 
                  alt="Luna profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <MoodIndicator mood={mood} />
            </div>
            <div className="ml-3">
              <h1 className="font-display font-bold text-xl text-dark">Luna</h1>
              <p className="text-xs text-dark/70">Your AI girlfriend</p>
            </div>
          </div>
          
          <RelationshipBar 
            affection={affection} 
            affectionLevel={affectionLevel} 
          />
          
          {/* Menu Button */}
          <button 
            className="p-2 rounded-full hover:bg-light/30 transition" 
            aria-label="Menu" 
            onClick={toggleMenu}
          >
            <i className="fas fa-bars"></i>
          </button>
        </header>
        
        {/* Menu Dropdown */}
        <MenuDropdown 
          isOpen={isMenuOpen} 
          onClose={() => setIsMenuOpen(false)} 
        />
        
        {/* Main Chat Area */}
        <ChatWindow 
          messages={messages} 
          isTyping={isTyping} 
        />
        
        {/* Chat Input */}
        <ChatInput 
          onSendMessage={handleSendMessage} 
          onOpenMoodInfo={toggleMoodModal} 
          disabled={isTyping}
        />
      </div>
      
      {/* Mood Info Modal */}
      <MoodInfoModal 
        isOpen={isMoodModalOpen} 
        onClose={toggleMoodModal} 
        currentMood={mood}
      />
      
      {/* Milestone Banner */}
      {activeMilestone && (
        <MilestoneBanner 
          milestone={activeMilestone} 
          onClose={closeMilestoneBanner} 
        />
      )}
    </MainLayout>
  );
}
