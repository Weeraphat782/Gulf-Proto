"use client"

import { Button } from "@/components/ui/button"
import type {
  TaskFormData,
  DropOff,
  LocationInfo,
  ContactInfo,
  ParcelDetails,
} from "@/lib/task-types"
import { createEmptyDropOff, LOCATIONS, CONTACTS, PARCEL_TYPES } from "@/lib/task-types"
import { LocationSection } from "./location-section"
import { ContactSection } from "./contact-section"
import { ParcelSection } from "./parcel-section"
import { Plus, ChevronDown, ChevronUp, MapPin, User, Package } from "lucide-react"
import { useState } from "react"

interface StepDropoffProps {
  data: TaskFormData
  onChange: (data: Partial<TaskFormData>) => void
}

function getLocationLabel(loc: LocationInfo): string {
  if (loc.selectionMode === "list" && loc.selectedLocation) {
    return (
      LOCATIONS.find((l) => l.value === loc.selectedLocation)?.label ||
      loc.selectedLocation
    )
  }
  return loc.manualLocation || "No location set"
}

function getContactLabel(contact: ContactInfo): string {
  if (contact.selectionMode === "list" && contact.selectedName) {
    return (
      CONTACTS.find((c) => c.value === contact.selectedName)?.label ||
      contact.selectedName
    )
  }
  return contact.manualName || "No contact set"
}

function getParcelLabel(parcel: ParcelDetails): string {
  if (parcel.parcelType) {
    return (
      PARCEL_TYPES.find((p) => p.value === parcel.parcelType)?.label ||
      parcel.parcelType
    )
  }
  return "No parcel type"
}

function CollapsedCard({
  dropOff,
  index,
  onExpand,
}: {
  dropOff: DropOff
  index: number
  onExpand: () => void
}) {
  const locLabel = dropOff.location.selectionMode === "list"
    ? (LOCATIONS.find(l => l.value === dropOff.location.selectedLocation)?.label || dropOff.location.selectedLocation)
    : dropOff.location.manualLocation

  return (
    <button
      type="button"
      onClick={onExpand}
      className="w-full rounded-xl border border-[#E5E5E5] bg-white p-4 text-left shadow-sm transition-all hover:border-[#2E3192]/30 hover:shadow-md"
    >
      <div className="mb-3 flex items-center justify-between">
        <h4 className="flex items-center gap-2 text-sm font-bold text-[#2E3192]">
          <span className="rounded-md bg-[#2E3192]/5 px-2 py-0.5 text-[10px] uppercase">Drop-off #{index + 1}</span>
          <span className="text-[#2E3192]/60">:</span>
          <span className="font-semibold">{locLabel || "// Location Name //"}</span>
        </h4>
        <div className="rounded-full bg-gray-50 p-1">
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
      </div>

      <div className="flex gap-4 items-start">
        {/* thumbnail/parcel image icon */}
        <div className="h-16 w-16 shrink-0 flex items-center justify-center rounded-lg border border-gray-100 bg-[#F8F9FA]">
          {dropOff.parcel.imagePreview ? (
            <img src={dropOff.parcel.imagePreview} alt="Parcel" className="h-full w-full object-cover rounded-lg" />
          ) : (
            <Package className="h-6 w-6 text-gray-300" />
          )}
        </div>

        {/* Address section */}
        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <MapPin className="h-3 w-3 text-red-500 fill-red-500 shrink-0" />
            <span className="truncate text-[11px] font-bold text-foreground">
              {dropOff.location.addressName || "Address Name"}
            </span>
          </div>
          <p className="truncate text-[10px] text-muted-foreground pl-5">
            {dropOff.location.addressDetails || "No address details available"}
          </p>
          <p className="truncate text-[10px] text-muted-foreground/70 italic pl-5">
            {dropOff.location.locationDescription || "No location description available"}
          </p>
        </div>

        {/* Contact/Parcel section */}
        <div className="hidden sm:flex flex-col gap-2 min-w-[140px] border-l border-gray-50 pl-4">
          <div className="flex items-center gap-2">
            <User className="h-3 w-3 text-gray-400 shrink-0" />
            <div className="min-w-0">
              <p className="truncate text-[10px] font-semibold text-foreground">
                {getContactLabel(dropOff.contact)}
              </p>
              <p className="text-[9px] text-muted-foreground">
                {dropOff.contact.contactNo || "No contact no."}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Package className="h-3 w-3 text-gray-400 shrink-0" />
            <div className="min-w-0">
              <p className="truncate text-[10px] text-foreground">
                {PARCEL_TYPES.find(p => p.value === dropOff.parcel.parcelType)?.label || "Parcel Type"}
              </p>
              <p className="truncate text-[9px] text-muted-foreground italic">
                {dropOff.parcel.remark || "(No Remarks)"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </button>
  )
}

export function StepDropoff({ data, onChange }: StepDropoffProps) {
  const [expandedIndex, setExpandedIndex] = useState(
    data.dropOffs.length - 1
  )

  const updateDropOff = (index: number, partial: Partial<DropOff>) => {
    const updated = data.dropOffs.map((d, i) =>
      i === index ? { ...d, ...partial } : d
    )
    onChange({ dropOffs: updated })
  }

  const addDropOff = () => {
    const newDropOffs = [...data.dropOffs, createEmptyDropOff()]
    onChange({ dropOffs: newDropOffs })
    setExpandedIndex(newDropOffs.length - 1)
  }

  return (
    <div className="flex flex-col gap-4">
      {data.dropOffs.map((dropOff, index) => {
        const isExpanded = index === expandedIndex

        if (!isExpanded) {
          return (
            <CollapsedCard
              key={dropOff.id}
              dropOff={dropOff}
              index={index}
              onExpand={() => setExpandedIndex(index)}
            />
          )
        }

        return (
          <div
            key={dropOff.id}
            className="flex flex-col gap-4 rounded-lg border-2 border-[#2E3192] p-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#2E3192]">
                Drop-off #{index + 1}
              </h3>
              {data.dropOffs.length > 1 && (
                <button
                  type="button"
                  onClick={() => setExpandedIndex(-1)}
                  className="text-[#2E3192] hover:text-[#24276E]"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
              )}
            </div>

            <LocationSection
              title="3.1 Drop Off Location"
              data={dropOff.location}
              onChange={(loc: LocationInfo) =>
                updateDropOff(index, { location: loc })
              }
              mapLabel="Select the drop off location"
            />

            <ContactSection
              title="3.2 Key Contact (Drop Off)"
              data={dropOff.contact}
              onChange={(contact: ContactInfo) =>
                updateDropOff(index, { contact })
              }
              showOrgType
            />

            <ParcelSection
              data={dropOff.parcel}
              onChange={(parcel: ParcelDetails) =>
                updateDropOff(index, { parcel })
              }
            />
          </div>
        )
      })}

      {/* Add new drop-off */}
      <Button
        type="button"
        variant="outline"
        onClick={addDropOff}
        className="border-2 border-dashed border-[#2E3192] text-[#2E3192] hover:bg-[#F0F0FF] hover:text-[#2E3192]"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add New Drop Off
      </Button>
    </div>
  )
}
