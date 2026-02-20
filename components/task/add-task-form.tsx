"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Stepper } from "./stepper"
import { StepTaskType } from "./step-task-type"
import { StepPickup } from "./step-pickup"
import { StepDropoff } from "./step-dropoff"
import { StepConfirmation } from "./step-confirmation"
import { createInitialFormData, type TaskFormData } from "@/lib/task-types"

export function AddTaskForm() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<TaskFormData>(
    createInitialFormData()
  )
  const [submitted, setSubmitted] = useState(false)

  const updateFormData = (partial: Partial<TaskFormData>) => {
    setFormData((prev) => ({ ...prev, ...partial }))
  }

  const handleNext = () => {
    if (step < 4) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleCancel = () => {
    setStep(1)
    setFormData(createInitialFormData())
    setSubmitted(false)
  }

  const handleSubmit = () => {
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <div className="rounded-lg border border-green-200 bg-[#E8F5E9] p-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-green-800">
            Task Created Successfully!
          </h2>
          <p className="mt-2 text-sm text-green-700">
            Your task has been submitted.
          </p>
          <Button
            onClick={handleCancel}
            className="mt-6 bg-[#2E3192] text-white hover:bg-[#24276E]"
          >
            Create Another Task
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4">
        <h1 className="inline-flex items-center gap-2">
          <span className="rounded bg-[#2E3192] px-3 py-1.5 text-base font-bold text-white">
            Add New Task
          </span>
        </h1>
        <Stepper currentStep={step} onStepClick={setStep} />
      </div>

      {/* Steps */}
      <div className="mb-6">
        {step === 1 && (
          <StepTaskType data={formData} onChange={updateFormData} />
        )}
        {step === 2 && (
          <StepPickup data={formData} onChange={updateFormData} />
        )}
        {step === 3 && (
          <StepDropoff data={formData} onChange={updateFormData} />
        )}
        {step === 4 && <StepConfirmation data={formData} />}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-end gap-3 border-t-2 border-[#8B5CF6]/30 pt-6 mt-8">
        <Button
          variant="ghost"
          onClick={handleCancel}
          className="bg-gray-100 text-[#2E3192] hover:bg-gray-200 uppercase font-bold text-xs h-10 px-10"
        >
          CANCEL
        </Button>
        {step < 4 ? (
          <Button
            onClick={handleNext}
            className="bg-[#2E3192] text-white hover:bg-[#24276E] uppercase font-bold text-xs h-10 px-12"
          >
            NEXT
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            className="bg-[#2E3192] text-white hover:bg-[#24276E] uppercase font-bold text-xs h-10 px-12"
          >
            SUBMIT
          </Button>
        )}
      </div>
    </div>
  )
}
