"use client"

import { useRef } from "react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PARCEL_TYPES, type ParcelDetails } from "@/lib/task-types"
import { Upload, ImageIcon, X } from "lucide-react"

interface ParcelSectionProps {
  data: ParcelDetails
  onChange: (data: ParcelDetails) => void
}

export function ParcelSection({ data, onChange }: ParcelSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const preview = URL.createObjectURL(file)
      onChange({ ...data, imageFile: file, imagePreview: preview })
    }
  }

  const removeImage = () => {
    if (data.imagePreview) {
      URL.revokeObjectURL(data.imagePreview)
    }
    onChange({ ...data, imageFile: null, imagePreview: null })
  }

  return (
    <div className="rounded-lg border border-[#E5E5E5] bg-card p-5">
      <Label className="mb-4 inline-block rounded bg-[#2E3192] px-3 py-1 text-sm font-bold text-white">
        3.3 Parcel Details
      </Label>

      <div className="mt-3 flex flex-col gap-4">
        {/* Parcel Type */}
        <Select
          value={data.parcelType}
          onValueChange={(val) => onChange({ ...data, parcelType: val })}
        >
          <SelectTrigger className="w-full border-[#E5E5E5] bg-white text-foreground focus:ring-[#2E3192]">
            <SelectValue placeholder="Select Parcel Type" />
          </SelectTrigger>
          <SelectContent>
            {PARCEL_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Image Upload */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          {data.imagePreview ? (
            <div className="relative inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.imagePreview}
                alt="Parcel preview"
                className="h-32 w-32 rounded-lg border border-[#E5E5E5] object-cover"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white shadow-md hover:bg-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-3 rounded-lg border-2 border-dashed border-[#CCC] px-6 py-4 text-sm text-muted-foreground transition-colors hover:border-[#2E3192] hover:bg-[#F0F0FF]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F5F5F5]">
                <ImageIcon className="h-5 w-5 text-[#999]" />
              </div>
              <div className="flex flex-col items-start gap-0.5">
                <span className="font-medium text-foreground">Upload Image</span>
                <span className="text-xs">Click to upload a parcel image</span>
              </div>
              <Upload className="ml-auto h-4 w-4 text-[#999]" />
            </button>
          )}
        </div>

        {/* Remark */}
        <Textarea
          placeholder="Remark"
          value={data.remark}
          onChange={(e) => onChange({ ...data, remark: e.target.value })}
          rows={2}
          className="border-[#E5E5E5] bg-white text-foreground placeholder:text-muted-foreground focus-visible:ring-[#2E3192]"
        />
      </div>
    </div>
  )
}
