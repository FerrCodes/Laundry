import { ReactNode } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  loading?: boolean;
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  loading = false,
  fullWidth = false,
  ...props
}: ButtonProps) {
  const baseStyle = `
    px-6 py-2.5 rounded-xl font-medium transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0A0A0A]
    disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
  `;

  const variants = {
    primary: `
      bg-blue-600 hover:bg-blue-700 text-white
      focus:ring-blue-500
    `,
    secondary: `
      bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white
      border border-[#333333]
    `,
    ghost: `
      text-blue-400 hover:text-blue-300 hover:bg-blue-500/10
    `,
  };

  return (
    <button
      {...props}
      className={`${baseStyle} ${variants[variant]}`}
      disabled={loading || props.disabled}
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  );
}