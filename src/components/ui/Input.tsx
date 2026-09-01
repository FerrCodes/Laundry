import { LucideIcon } from "lucide-react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: LucideIcon;
  error?: string;
  showPasswordToggle?: boolean;
}

export default function Input({
  label,
  icon: Icon,
  error,
  showPasswordToggle = false,
  type = "text",
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordType = type === "password";
  const inputType = isPasswordType && showPassword ? "text" : type;

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-300">
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        
        <input
          {...props}
          type={inputType}
          className={`
            w-full pl-10 pr-3 py-2.5 bg-[#1A1A1A] border rounded-xl
            focus:outline-none focus:ring-2 focus:ring-blue-500
            text-white placeholder-gray-500 transition-all duration-200
            ${isPasswordType && showPasswordToggle ? 'pr-11' : ''}
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-[#333333] focus:border-blue-500'}
          `}
        />
        
        {isPasswordType && showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}