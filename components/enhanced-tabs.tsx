"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface EnhancedTabsProps {
  defaultValue: string
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  className?: string
}

interface EnhancedTabsListProps {
  children: React.ReactNode
  className?: string
}

interface EnhancedTabsTriggerProps {
  value: string
  children: React.ReactNode
  className?: string
}

interface EnhancedTabsContentProps {
  value: string
  children: React.ReactNode
  className?: string
}

const TabsContext = React.createContext<{
  value: string
  onValueChange: (value: string) => void
} | null>(null)

function EnhancedTabs(props: EnhancedTabsProps) {
  const [internalValue, setInternalValue] = React.useState(props.defaultValue)
  const currentValue = props.value !== undefined ? props.value : internalValue

  const handleValueChange = React.useCallback(
    (newValue: string) => {
      setInternalValue(newValue)
      if (props.onValueChange) {
        props.onValueChange(newValue)
      }
    },
    [props.onValueChange],
  )

  return (
    <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
      <div className={cn("space-y-4", props.className)}>{props.children}</div>
    </TabsContext.Provider>
  )
}

function EnhancedTabsList(props: EnhancedTabsListProps) {
  return (
    <div
      className={cn("relative grid grid-cols-2 w-full rounded-lg border border-white/50 bg-gray-950", props.className)}
    >
      {props.children}
    </div>
  )
}

function EnhancedTabsTrigger(props: EnhancedTabsTriggerProps) {
  const context = React.useContext(TabsContext)
  if (!context) throw new Error("TabsTrigger must be used within Tabs")

  const isActive = context.value === props.value

  return (
    <button
      className={cn(
        "relative z-10 flex-1 text-center text-sm font-medium transition-all py-3 px-4",
        isActive ? "text-white font-bold" : "text-gray-400 hover:text-gray-300",
        props.className,
      )}
      onClick={() => context.onValueChange(props.value)}
    >
      {props.children}
      {isActive && (
        <motion.div
          className="absolute inset-0 z-[-1] bg-amber-500"
          layoutId="tab-highlight"
          transition={{ type: "spring", duration: 0.5 }}
        />
      )}
    </button>
  )
}

function EnhancedTabsContent(props: EnhancedTabsContentProps) {
  const context = React.useContext(TabsContext)
  if (!context) throw new Error("TabsContent must be used within Tabs")

  const isActive = context.value === props.value

  return isActive ? (
    <motion.div
      className={cn("rounded-md", props.className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
    >
      {props.children}
    </motion.div>
  ) : null
}

export { EnhancedTabs, EnhancedTabsList, EnhancedTabsTrigger, EnhancedTabsContent }
