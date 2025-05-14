interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "rounded" | "rounded-lg";
}

export function Logo({
  className = "",
  size = "md",
  variant = "default",
}: LogoProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-16 h-16",
  };

  const variantClasses = {
    default: "",
    rounded: "rounded",
    "rounded-lg": "rounded-lg",
  };

  const iconSizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-8 h-8",
  };

  return (
    <div
      className={`inline-flex items-center justify-center bg-gradient-to-tr from-blue-600 to-purple-600 shadow-md ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      <svg
        className={`text-white ${iconSizeClasses[size]}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    </div>
  );
}
