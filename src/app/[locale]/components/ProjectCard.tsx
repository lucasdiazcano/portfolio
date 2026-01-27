import Badge from './Badge';

interface ProjectCardProps {
  title: string;
  location: string;
  description: string;
  tags: string[];
  highlightBadge?: {
    text: string;
    variant?: 'default' | 'highlight';
  };
  specialBadge?: string;
}

export default function ProjectCard({ 
  title, 
  location, 
  description, 
  tags,
  highlightBadge,
  specialBadge
}: ProjectCardProps) {
  return (
    <div className="backdrop-blur-md bg-card/40 border border-border rounded-lg p-8 md:p-10 hover:border-primary/50 transition-colors shadow-2xl">
      <div className="flex items-center gap-3 mb-3">
        <h3 className="text-2xl md:text-3xl font-bold">{title}</h3>
        {specialBadge && (
          <span className="px-3 py-1.5 bg-destructive text-destructive-foreground text-sm md:text-base font-bold rounded">
            {specialBadge}
          </span>
        )}
      </div>
      
      <p className="text-muted-foreground/80 text-sm md:text-base mb-3">{location}</p>
      
      {highlightBadge && (
        <div className="mb-4">
          <Badge variant={highlightBadge.variant || 'highlight'}>
            {highlightBadge.text}
          </Badge>
        </div>
      )}
      
      <p className="text-foreground mb-6 text-base md:text-lg leading-relaxed">
        {description}
      </p>
      
      <div className="flex flex-wrap gap-3">
        {tags.map((tag, index) => (
          <Badge key={index}>{tag}</Badge>
        ))}
      </div>
    </div>
  );
}
