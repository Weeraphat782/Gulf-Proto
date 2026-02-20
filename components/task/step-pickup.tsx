"use client"

import type { TaskFormData, LocationInfo, ContactInfo } from "@/lib/task-types"
import { LocationSection } from "./location-section"
import { ContactSection } from "./contact-section"

interface StepPickupProps {
  data: TaskFormData
  onChange: (data: Partial<TaskFormData>) => void
}

export function StepPickup({ data, onChange }: StepPickupProps) {
  return (
    <div className="flex flex-col gap-6">
      <LocationSection
        title="2.1 Pick up Location"
        data={data.pickupLocation}
        onChange={(loc: LocationInfo) => onChange({ pickupLocation: loc })}
        mapLabel="Select the pick up location"
      />

      <ContactSection
        title="2.2 Key Contact (Pick up)"
        data={data.pickupContact}
        onChange={(contact: ContactInfo) =>
          onChange({ pickupContact: contact })
        }
      />
    </div>
  )
}
