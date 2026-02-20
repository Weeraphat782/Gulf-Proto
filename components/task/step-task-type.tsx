"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TASK_TYPES, type TaskFormData } from "@/lib/task-types"
import { ArrowRightLeft, Wrench } from "lucide-react"

interface StepTaskTypeProps {
  data: TaskFormData
  onChange: (data: Partial<TaskFormData>) => void
}

export function StepTaskType({ data, onChange }: StepTaskTypeProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Task Mode */}
      <div className="rounded-lg border border-[#E5E5E5] bg-card p-5">
        <Label className="mb-4 inline-block rounded bg-[#2E3192] px-3 py-1 text-sm font-bold text-white">
          Task Mode
        </Label>
        <div className="mt-3 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => onChange({ taskMode: "pick-and-drop" })}
            className={`flex items-center gap-3 rounded-lg border-2 p-4 text-left transition-colors ${data.taskMode === "pick-and-drop"
                ? "border-[#2E3192] bg-[#F0F0FF]"
                : "border-[#E5E5E5] bg-card hover:border-[#CCC]"
              }`}
          >
            <div
              className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${data.taskMode === "pick-and-drop"
                  ? "border-[#2E3192]"
                  : "border-[#CCC]"
                }`}
            >
              {data.taskMode === "pick-and-drop" && (
                <div className="h-2.5 w-2.5 rounded-full bg-[#2E3192]" />
              )}
            </div>
            <span className="flex-1 font-semibold text-foreground">
              Pick and Drop
            </span>
            <ArrowRightLeft className="h-5 w-5 text-green-600" />
          </button>
          <button
            type="button"
            onClick={() => onChange({ taskMode: "service-task" })}
            className={`flex items-center gap-3 rounded-lg border-2 p-4 text-left transition-colors ${data.taskMode === "service-task"
                ? "border-[#2E3192] bg-[#F0F0FF]"
                : "border-[#E5E5E5] bg-card hover:border-[#CCC]"
              }`}
          >
            <div
              className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${data.taskMode === "service-task"
                  ? "border-[#2E3192]"
                  : "border-[#CCC]"
                }`}
            >
              {data.taskMode === "service-task" && (
                <div className="h-2.5 w-2.5 rounded-full bg-[#2E3192]" />
              )}
            </div>
            <span className="flex-1 font-semibold text-foreground">
              Service Task
            </span>
            <Wrench className="h-5 w-5 text-[#2E3192]" />
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t-2 border-dashed border-[#E5E5E5]" />

      {/* Task Name */}
      <div className="rounded-lg border border-[#E5E5E5] bg-card p-5">
        <Label
          htmlFor="taskName"
          className="mb-4 inline-block rounded bg-[#2E3192] px-3 py-1 text-sm font-bold text-white"
        >
          Task Name
        </Label>
        <div className="mt-3">
          <Input
            id="taskName"
            placeholder="Task Name*"
            value={data.taskName}
            onChange={(e) => onChange({ taskName: e.target.value })}
            className="border-[#E5E5E5] bg-white placeholder:text-muted-foreground focus-visible:ring-[#2E3192]"
          />
        </div>
      </div>

      {/* Task Type */}
      <div className="rounded-lg border border-[#E5E5E5] bg-card p-5">
        <Label className="mb-4 inline-block rounded bg-[#2E3192] px-3 py-1 text-sm font-bold text-white">
          Task Type
        </Label>
        <div className="mt-3 flex flex-col gap-3">
          <Select
            value={data.taskType}
            onValueChange={(val) => onChange({ taskType: val })}
          >
            <SelectTrigger className="w-full border-[#E5E5E5] bg-white text-foreground focus:ring-[#2E3192] data-[state=open]:text-foreground [&[data-state]]:text-foreground">
              <SelectValue placeholder="Select Task Type*" />
            </SelectTrigger>
            <SelectContent>
              {TASK_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Textarea
            placeholder="Description"
            value={data.description}
            onChange={(e) => onChange({ description: e.target.value })}
            rows={3}
            className="border-[#E5E5E5] bg-white placeholder:text-muted-foreground focus-visible:ring-[#2E3192]"
          />
        </div>
      </div>
    </div>
  )
}
