"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface EnchantedButtonProps extends Omit<React.ComponentProps<typeof Button>, 'variant' | 'size'> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

const EnchantedButton = React.forwardRef<
  React.ElementRef<typeof Button>,
  EnchantedButtonProps
>(({ className, variant = 'primary', size = 'md', ...props }, ref) => {
  const baseClasses = "transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-300"
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-pink-200 to-purple-200 text-purple-700 hover:from-pink-300 hover:to-purple-300 shadow-md hover:shadow-xl rounded-full font-semibold",
    secondary: "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-600 border border-gray-300 shadow-sm hover:from-gray-200 hover:to-gray-300",
    outline: "bg-white/80 backdrop-blur-sm border border-purple-200 text-purple-700 hover:bg-purple-50 shadow-md hover:shadow-lg"
  }

  const sizeClasses = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4',
    lg: 'h-12 px-6 text-lg'
  }

  return (
    <Button
      ref={ref}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
})

EnchantedButton.displayName = "EnchantedButton"

export { EnchantedButton } 