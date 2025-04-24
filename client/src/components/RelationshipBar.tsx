interface RelationshipBarProps {
  affection: number;
  affectionLevel: string;
}

const RelationshipBar: React.FC<RelationshipBarProps> = ({ 
  affection, 
  affectionLevel 
}) => {
  return (
    <div className="hidden md:flex items-center">
      <span className="text-xs mr-2">Affection</span>
      <div className="bg-light/50 w-36 h-4 rounded-full shadow-inner overflow-hidden">
        <div 
          className="bg-gradient-to-r from-pink-300 to-accent h-full rounded-full transition-all duration-500" 
          style={{ width: `${Math.min(affection, 100)}%` }}
        />
      </div>
      <div className="ml-2 text-xs font-semibold">{affectionLevel}</div>
    </div>
  );
};

export default RelationshipBar;
