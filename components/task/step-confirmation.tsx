"use client"

import type { TaskFormData, DropOff } from "@/lib/task-types"
import {
  TASK_TYPES,
  LOCATIONS,
  CONTACTS,
  PARCEL_TYPES,
} from "@/lib/task-types"
import {
  MapPin,
  User,
  Package,
  FileText,
  Truck,
  Info,
} from "lucide-react"

interface StepConfirmationProps {
  data: TaskFormData
}

function getLocLabel(loc: any) {
  if (loc.selectionMode === "list") {
    return LOCATIONS.find((l) => l.value === loc.selectedLocation)?.label || loc.selectedLocation
  }
  return loc.manualLocation
}

function getContactLabel(contact: any) {
  if (contact.selectionMode === "list") {
    return CONTACTS.find((c) => c.value === contact.selectedName)?.label || contact.selectedName
  }
  return contact.manualName
}

export function StepConfirmation({ data }: StepConfirmationProps) {
  const taskTypeLabel =
    TASK_TYPES.find((t) => t.value === data.taskType)?.label || data.taskType

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Page Title */}
      <div className="flex justify-start">
        <span className="inline-block rounded border-2 border-[#2E3192] px-4 py-1.5 text-sm font-bold text-[#2E3192]">
          Pick and Drop: Confirmation
        </span>
      </div>

      {/* Task Units Loop */}
      <div className="space-y-6">
        {data.dropOffs.map((dropOff, index) => {
          const unitNumber = (index + 1).toString().padStart(2, "0")

          return (
            <div
              key={dropOff.id}
              className="relative overflow-hidden rounded-xl border border-[#E5E5E5] bg-white p-6 shadow-sm"
            >
              {/* Task Header */}
              <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2E3192]/10">
                    <Truck className="h-5 w-5 text-[#2E3192]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#2E3192]">
                    Task Name - {unitNumber}
                  </h3>
                </div>
                <div className="rounded bg-[#2E3192]/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#2E3192]">
                  {data.taskMode.replace("-", " ")}
                </div>
              </div>

              {/* Task Detail Summary */}
              <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Task Type:</span>
                  <p className="text-sm font-semibold text-foreground">{taskTypeLabel || "Not specified"}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Task Description:</span>
                  <p className="text-sm text-foreground leading-relaxed">{data.description || "No description provided"}</p>
                </div>
              </div>

              {/* Pickup & Dropoff Grid */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                {/* Pick-up Location Card */}
                <div className="rounded-xl border border-[#E5E5E5] p-5 transition-colors hover:border-[#2E3192]/30">
                  <h4 className="mb-4 flex items-center gap-2 text-sm font-bold text-[#2E3192]">
                    <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                    Pick-up Location : {getLocLabel(data.pickupLocation)}
                  </h4>

                  <div className="space-y-5">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-full bg-red-50 p-1.5">
                        <MapPin className="h-4 w-4 text-red-500 fill-red-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-bold text-foreground">
                          {data.pickupLocation.addressName || "Point on Map"}
                        </p>
                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                          {data.pickupLocation.addressDetails || `${data.pickupLocation.lat?.toFixed(4)}, ${data.pickupLocation.lng?.toFixed(4)}`}
                        </p>
                        <p className="mt-2 text-[10px] italic text-muted-foreground border-l-2 border-gray-100 pl-2">
                          {data.pickupLocation.locationDescription || "No specific instructions"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 border-t border-gray-50 pt-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50">
                        <User className="h-4 w-4 text-[#2E3192]" />
                      </div>
                      <div className="grid grid-cols-2 gap-4 flex-1">
                        <div>
                          <span className="text-[9px] font-bold uppercase tracking-tighter text-muted-foreground">Name:</span>
                          <p className="text-xs font-semibold">{getContactLabel(data.pickupContact)}</p>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold uppercase tracking-tighter text-muted-foreground">Contact No:</span>
                          <p className="text-xs font-semibold">{data.pickupContact.contactNo || "-"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Drop-off Location Card */}
                <div className="rounded-xl border border-[#E5E5E5] p-5 transition-colors hover:border-[#2E3192]/30">
                  <h4 className="mb-4 flex items-center gap-2 text-sm font-bold text-[#2E3192]">
                    <span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
                    Drop-off Location : {getLocLabel(dropOff.location)}
                  </h4>

                  <div className="space-y-5">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-full bg-red-50 p-1.5">
                        <MapPin className="h-4 w-4 text-red-500 fill-red-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-bold text-foreground">
                          {dropOff.location.addressName || "Point on Map"}
                        </p>
                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                          {dropOff.location.addressDetails || `${dropOff.location.lat?.toFixed(4)}, ${dropOff.location.lng?.toFixed(4)}`}
                        </p>
                        <p className="mt-2 text-[10px] italic text-muted-foreground border-l-2 border-gray-100 pl-2">
                          {dropOff.location.locationDescription || "No specific instructions"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 border-t border-gray-50 pt-4">
                      {dropOff.parcel.imagePreview ? (
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-gray-100">
                          <img
                            src={dropOff.parcel.imagePreview}
                            alt="Parcel"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-gray-50 border border-gray-100">
                          <Package className="h-6 w-6 text-gray-300" />
                        </div>
                      )}

                      <div className="flex-1 space-y-3">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                          <div>
                            <span className="text-[9px] font-bold uppercase tracking-tighter text-muted-foreground">Name:</span>
                            <p className="text-xs font-semibold">{getContactLabel(dropOff.contact)}</p>
                          </div>
                          <div>
                            <span className="text-[9px] font-bold uppercase tracking-tighter text-muted-foreground">Contact No:</span>
                            <p className="text-xs font-semibold">{dropOff.contact.contactNo || "-"}</p>
                          </div>
                          <div>
                            <span className="text-[9px] font-bold uppercase tracking-tighter text-muted-foreground">Parcel Type:</span>
                            <p className="text-xs font-semibold">
                              {PARCEL_TYPES.find(p => p.value === dropOff.parcel.parcelType)?.label || dropOff.parcel.parcelType || "-"}
                            </p>
                          </div>
                          <div className="col-span-2">
                            <span className="text-[9px] font-bold uppercase tracking-tighter text-muted-foreground">Remarks:</span>
                            <p className="text-[10px] text-muted-foreground italic leading-tight">{dropOff.parcel.remark || "-"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer Total Task */}
      <div className="flex justify-end pt-4">
        <div className="flex items-center gap-3 rounded-lg border-2 border-dashed border-[#2E3192] px-6 py-2.5">
          <span className="text-sm font-bold text-[#2E3192] uppercase tracking-wide">Total Task:</span>
          <span className="text-2xl font-black text-[#2E3192]">{data.dropOffs.length}</span>
        </div>
      </div>
    </div>
  )
}

