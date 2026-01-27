interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'highlight';
}

export default function Badge({ children, variant = 'default' }: BadgeProps) {
  const baseClasses = "px-4 py-2 rounded-full text-sm md:text-base font-bold";
  
  const variantClasses = {
    default: "bg-gray-800 border border-gray-700 text-gray-300",
    highlight: "text-white border-2 border-blue-400"
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant]}`}>
      {children}
    </span>
  );
}
