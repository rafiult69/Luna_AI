import React from 'react';
import { useToast } from '@/hooks/use-toast';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { toast } = useToast();

  // Check for OpenRouter API key (would normally be done server-side)
  React.useEffect(() => {
    const checkAPIKey = async () => {
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: 'test' }),
        });
        
        const data = await response.json();
        
        if (response.status === 500 && data.message === "OpenRouter API key not configured") {
          toast({
            title: "API Key Missing",
            description: "OpenRouter API key is not configured. Some features may not work.",
            variant: "destructive",
            duration: 5000,
          });
        }
      } catch (error) {
        console.error("Error checking API configuration:", error);
      }
    };
    
    checkAPIKey();
  }, [toast]);

  return (
    <div className="bg-gradient-to-b from-primary/30 to-secondary/30 min-h-screen font-body text-dark">
      <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />
      {children}
    </div>
  );
};
