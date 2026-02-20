"use client"

import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

interface Step {
  number: number
  label: string
}

const STEPS: Step[] = [
  { number: 1, label: "Task Type and Name" },
  { number: 2, label: "Pick-up Location" },
  { number: 3, label: "Drop-off Location" },
  { number: 4, label: "Confirmation" },
]

interface StepperProps {
  currentStep: number
  onStepClick?: (step: number) => void
}

export function Stepper({ currentStep, onStepClick }: StepperProps) {
  return (
    <nav aria-label="Progress" className="flex items-center gap-1 sm:gap-2">
      {STEPS.map((step, index) => {
        const isCompleted = step.number < currentStep
        const isCurrent = step.number === currentStep
        const isFuture = step.number > currentStep

        return (
          <div key={step.number} className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => onStepClick?.(step.number)}
              disabled={!onStepClick}
              className={cn(
                "flex items-center gap-1.5 transition-opacity hover:opacity-80 active:scale-95",
                !onStepClick && "cursor-default"
              )}
            >
              <div
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-colors",
                  isCompleted && "bg-[#2E3192] text-white",
                  isCurrent && "bg-[#2E3192] text-white",
                  isFuture && "bg-[#E5E5E5] text-[#999]"
                )}
              >
                {isCompleted ? <Check className="h-3.5 w-3.5" /> : step.number}
              </div>
              <span
                className={cn(
                  "hidden text-xs font-medium sm:inline",
                  isCompleted && "text-[#2E3192]",
                  isCurrent && "text-[#2E3192] font-bold border-b border-[#2E3192]/30",
                  isFuture && "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </button>
            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  "h-0.5 w-4 sm:w-8",
                  step.number < currentStep ? "bg-[#2E3192]" : "bg-[#E5E5E5]"
                )}
              />
            )}
          </div>
        )
      })}
    </nav>
  )
}
