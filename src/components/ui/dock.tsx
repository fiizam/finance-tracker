"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { motion } from "framer-motion"

export interface DockItem {
  icon: React.ComponentType<{ className?: string }>
  label: string
  onClick?: () => void
  href?: string
  isActive?: boolean
  isPrimary?: boolean
}

export interface DockProps {
  className?: string
  activeLabel?: string
  items: DockItem[]
}

export default function Dock({ items, className, activeLabel }: DockProps) {
  const [active, setActive] = React.useState<string | null>(
    activeLabel || items.find((i) => i.isActive)?.label || null
  )
  const [hovered, setHovered] = React.useState<number | null>(null)

  React.useEffect(() => {
    if (activeLabel !== undefined) {
      setActive(activeLabel)
    }
  }, [activeLabel])

  return (
    <div className={cn("flex items-center justify-center w-full py-12", className)}>
      <motion.div
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className={cn(
          "flex items-end gap-2.5 sm:gap-4 px-3 sm:px-4 py-2.5 sm:py-3 rounded-3xl",
          "border border-border bg-surface/85 backdrop-blur-2xl shadow-xl"
        )}
        style={{
          transform: "perspective(600px) rotateX(10deg)", // arc layout illusion
        }}
      >
        <TooltipProvider delayDuration={100}>
          {items.map((item, i) => {
            const isActive = active === item.label || item.isActive
            const isHovered = hovered === i
            const isPrimary = item.isPrimary

            return (
              <Tooltip key={item.label}>
                <TooltipTrigger asChild>
                  <motion.div
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    animate={{
                      scale: isHovered ? (isPrimary ? 1.25 : 1.18) : (isPrimary ? 1.1 : 1),
                      rotate: isHovered ? (isPrimary ? 0 : -5) : 0,
                    }}
                    whileTap={{ scale: 0.92 }}
                    transition={{ type: "spring", stiffness: 350, damping: 22 }}
                    className="relative flex flex-col items-center"
                  >
                    <Button
                      variant={isPrimary ? "default" : "ghost"}
                      size="icon"
                      className={cn(
                        "rounded-2xl relative transition-all duration-200",
                        isPrimary
                          ? "bg-accent text-white shadow-md shadow-accent/30 hover:bg-accent-hover hover:scale-105 active:scale-95 w-11 h-11 -mt-2.5"
                          : "hover:bg-surface-hover/80",
                        isHovered && !isPrimary && "shadow-lg shadow-accent/20 bg-surface-hover"
                      )}
                      onClick={() => {
                        setActive(item.label)
                        item.onClick?.()
                      }}
                    >
                      <item.icon
                        className={cn(
                          "transition-colors",
                          isPrimary ? "h-6 w-6 text-white" : "h-5 w-5 sm:h-6 sm:w-6",
                          !isPrimary && (isActive ? "text-accent" : "text-text-muted hover:text-text-main")
                        )}
                      />
                      {/* Glowing ring effect */}
                      {isHovered && !isPrimary && (
                        <motion.span
                          layoutId="glow"
                          className="absolute inset-0 rounded-2xl border border-accent/40"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        />
                      )}
                    </Button>

                    {/* Active indicator */}
                    {isActive && !isPrimary && (
                      <motion.div
                        layoutId="dot"
                        className="w-1.5 h-1.5 rounded-full bg-accent mt-1"
                      />
                    )}
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs font-medium">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            )
          })}
        </TooltipProvider>
      </motion.div>
    </div>
  )
}
