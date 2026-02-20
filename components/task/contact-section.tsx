"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  CONTACTS,
  ORGANIZATION_TYPES,
  type ContactInfo,
} from "@/lib/task-types"

interface ContactSectionProps {
  title: string
  data: ContactInfo
  onChange: (data: ContactInfo) => void
  showOrgType?: boolean
}

export function ContactSection({
  title,
  data,
  onChange,
  showOrgType = false,
}: ContactSectionProps) {
  const handleSelectContact = (val: string) => {
    const contact = CONTACTS.find((c) => c.value === val)
    if (contact) {
      onChange({
        ...data,
        selectedName: val,
        contactNo: contact.phone,
        email: contact.email,
      })
    } else {
      onChange({ ...data, selectedName: val })
    }
  }

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
            <RadioGroupItem value="list" id={`${title}-clist`} />
            <Label htmlFor={`${title}-clist`} className="cursor-pointer text-sm text-foreground">
              Select from the list
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="manual" id={`${title}-cmanual`} />
            <Label htmlFor={`${title}-cmanual`} className="cursor-pointer text-sm text-foreground">
              Enter Information Manually
            </Label>
          </div>
        </RadioGroup>

        {/* Organization type (for drop-off) */}
        {showOrgType && data.selectionMode === "list" && (
          <Select
            value={data.organizationType || ""}
            onValueChange={(val) =>
              onChange({ ...data, organizationType: val })
            }
          >
            <SelectTrigger className="w-full border-[#E5E5E5] bg-white text-foreground focus:ring-[#2E3192]">
              <SelectValue placeholder="Organization User / Key Contact List" />
            </SelectTrigger>
            <SelectContent>
              {ORGANIZATION_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Conditional field */}
        {data.selectionMode === "list" ? (
          <Select
            value={data.selectedName}
            onValueChange={handleSelectContact}
          >
            <SelectTrigger className="w-full border-[#E5E5E5] bg-white text-foreground focus:ring-[#2E3192]">
              <SelectValue placeholder="Select Name" />
            </SelectTrigger>
            <SelectContent>
              {CONTACTS.map((contact) => (
                <SelectItem key={contact.value} value={contact.value}>
                  {contact.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Input
            placeholder="Enter name"
            value={data.manualName}
            onChange={(e) =>
              onChange({ ...data, manualName: e.target.value })
            }
            className="border-[#E5E5E5] bg-white text-foreground placeholder:text-muted-foreground focus-visible:ring-[#2E3192]"
          />
        )}

        {/* Contact No */}
        <Input
          placeholder="Contact No.*"
          value={data.contactNo}
          onChange={(e) =>
            onChange({ ...data, contactNo: e.target.value })
          }
          className="border-[#E5E5E5] bg-white text-foreground placeholder:text-muted-foreground focus-visible:ring-[#2E3192]"
        />

        {/* Email */}
        <Input
          placeholder="Email"
          type="email"
          value={data.email}
          onChange={(e) => onChange({ ...data, email: e.target.value })}
          className="border-[#E5E5E5] bg-white text-foreground placeholder:text-muted-foreground focus-visible:ring-[#2E3192]"
        />
      </div>
    </div>
  )
}
