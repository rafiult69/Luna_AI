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
      <span className="text-xs mr-2 font-medium text-dark dark:text-light/90">Affection</span>
      <div className="bg-light/50 dark:bg-dark/30 w-36 h-4 rounded-full shadow-inner overflow-hidden border border-secondary/20 dark:border-primary/20">
        <div 
          className="bg-gradient-to-r from-primary/60 to-accent h-full rounded-full transition-all duration-700 ease-in-out" 
          style={{ width: `${Math.min(affection, 100)}%` }}
        />
      </div>
      <div className="ml-2 text-xs font-semibold text-dark dark:text-light/90 px-2 py-1 rounded-md bg-light/40 dark:bg-dark/30 shadow-sm">
        {affectionLevel}
      </div>
    </div>
  );
};

export default RelationshipBar;
