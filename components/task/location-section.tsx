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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { LOCATIONS, type LocationInfo } from "@/lib/task-types"
import { MapPicker } from "./map-picker"

interface LocationSectionProps {
  title: string
  data: LocationInfo
  onChange: (data: LocationInfo) => void
  mapLabel?: string
}

export function LocationSection({
  title,
  data,
  onChange,
  mapLabel,
}: LocationSectionProps) {
  return (
    <div className="rounded-lg border border-[#E5E5E5] bg-card p-5">
      <Label className="mb-4 inline-block rounded bg-[#2E3192] px-3 py-1 text-sm font-bold text-white">
        {title}
      </Label>

      <div className="mt-3 flex flex-col gap-4">
        {/* Selection mode */}
        <RadioGroup
          value={data.selectionMode}
          onValueChange={(val: "list" | "manual") =>
            onChange({ ...data, selectionMode: val })
          }
          className="flex flex-wrap gap-4"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="list" id={`${title}-list`} />
            <Label htmlFor={`${title}-list`} className="cursor-pointer text-sm text-foreground">
              Select from the list
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="manual" id={`${title}-manual`} />
            <Label htmlFor={`${title}-manual`} className="cursor-pointer text-sm text-foreground">
              Enter Information Manually
            </Label>
          </div>
        </RadioGroup>

        {/* Conditional field */}
        {data.selectionMode === "list" ? (
          <Select
            value={data.selectedLocation}
            onValueChange={(val) =>
              onChange({ ...data, selectedLocation: val })
            }
          >
            <SelectTrigger className="w-full border-[#E5E5E5] bg-white text-foreground focus:ring-[#2E3192]">
              <SelectValue placeholder="Select Location Name" />
            </SelectTrigger>
            <SelectContent>
              {LOCATIONS.map((loc) => (
                <SelectItem key={loc.value} value={loc.value}>
                  {loc.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Input
            placeholder="Enter location name"
            value={data.manualLocation}
            onChange={(e) =>
              onChange({ ...data, manualLocation: e.target.value })
            }
            className="border-[#E5E5E5] bg-white text-foreground placeholder:text-muted-foreground focus-visible:ring-[#2E3192]"
          />
        )}

        {/* Map picker */}
        <MapPicker
          lat={data.lat}
          lng={data.lng}
          onSelect={(lat, lng, addressName, addressDetails) =>
            onChange({ ...data, lat, lng, addressName, addressDetails })
          }
          label={mapLabel}
        />

        {/* Location Description */}
        <Textarea
          placeholder="Location Description"
          value={data.locationDescription}
          onChange={(e) =>
            onChange({ ...data, locationDescription: e.target.value })
          }
          rows={2}
          className="border-[#E5E5E5] bg-white text-foreground placeholder:text-muted-foreground focus-visible:ring-[#2E3192]"
        />
      </div>
    </div>
  )
}
