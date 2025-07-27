"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { useFlowerExplosion } from "./flower-explosion-context"

interface FlowerButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {
  children: React.ReactNode
}

export default function FlowerButton({ children, onClick, ...props }: FlowerButtonProps) {
  const { triggerExplosion } = useFlowerExplosion()

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Get button position
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    console.log("🌸 Button clicked at:", centerX, centerY)

    // Trigger explosion
    triggerExplosion(centerX, centerY)

    // Call the original onClick if provided
    if (onClick) {
      onClick(e)
    }
  }

  return (
    <Button {...props} onClick={handleClick}>
      {children}
    </Button>
  )
}
