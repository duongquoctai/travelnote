"use client";

import { Icon } from "@iconify/react";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: string;
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

const Button = ({
  children,
  icon,
  variant = "primary",
  size = "md",
  isLoading = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) => {
  const variants = {
    primary:
      "bg-blue-500 text-white hover:bg-blue-600 shadow-sm shadow-blue-200 dark:shadow-none",
    secondary:
      "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700",
    danger:
      "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/10 dark:text-red-500 dark:hover:bg-red-900/20",
    ghost:
      "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors",
    outline:
      "border-2 border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-blue-500 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs rounded-lg",
    md: "px-4 py-2.5 text-sm rounded-xl font-medium",
    lg: "px-6 py-3 text-base rounded-2xl font-semibold",
    icon: "p-1.5 rounded-lg",
  };

  const currentVariant = variants[variant];
  const currentSize = sizes[size];

  return (
    <button
      disabled={disabled || isLoading}
      className={`flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 ${currentVariant} ${currentSize} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Icon icon="mdi:loading" className="animate-spin" />
      ) : (
        icon && (
          <Icon
            icon={icon}
            className={size === "icon" ? "w-4 h-4" : "w-5 h-5"}
          />
        )
      )}
      {children}
    </button>
  );
};

export default Button;
