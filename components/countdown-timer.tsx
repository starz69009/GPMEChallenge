"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function CountdownTimer({ dateFin, className }: { dateFin: string; className?: string }) {
  const [timeLeft, setTimeLeft] = useState<number>(0)

  useEffect(() => {
    const target = new Date(dateFin).getTime()

    function update() {
      const now = Date.now()
      const diff = Math.max(0, target - now)
      setTimeLeft(diff)
    }

    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [dateFin])

  const totalSeconds = Math.floor(timeLeft / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const isExpired = timeLeft <= 0
  const isUrgent = !isExpired && totalSeconds < 300 // < 5 min
  const isWarning = !isExpired && !isUrgent && totalSeconds < 900 // < 15 min

  const colorClass = isExpired
    ? "bg-destructive/15 text-destructive border-destructive/30"
    : isUrgent
    ? "bg-destructive/15 text-destructive border-destructive/30 animate-pulse"
    : isWarning
    ? "bg-warning/15 text-warning border-warning/30"
    : "bg-success/15 text-success border-success/30"

  const pad = (n: number) => n.toString().padStart(2, "0")

  return (
    <div className={cn("inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-mono font-medium", colorClass, className)}>
      {isExpired ? (
        <span>Expire</span>
      ) : (
        <span>{hours > 0 ? `${pad(hours)}:` : ""}{pad(minutes)}:{pad(seconds)}</span>
      )}
    </div>
  )
}
