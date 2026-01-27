interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'highlight';
}

export default function Badge({ children, variant = 'default' }: BadgeProps) {
  const baseClasses = "px-4 py-2 rounded-full text-sm md:text-base font-bold";
  
  const variantClasses = {
    default: "bg-secondary border border-border text-secondary-foreground",
    highlight: "text-foreground border-2 border-primary"
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant]}`}>
      {children}
    </span>
  );
}
