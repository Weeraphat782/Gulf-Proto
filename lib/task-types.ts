export interface ContactInfo {
  selectionMode: "list" | "manual"
  selectedName: string
  manualName: string
  contactNo: string
  email: string
  organizationType?: string
}

export interface LocationInfo {
  selectionMode: "list" | "manual"
  selectedLocation: string
  manualLocation: string
  locationDescription: string
  addressName?: string
  addressDetails?: string
  lat: number | null
  lng: number | null
}

export interface ParcelDetails {
  parcelType: string
  remark: string
  imageFile: File | null
  imagePreview: string | null
}

export interface DropOff {
  id: string
  location: LocationInfo
  contact: ContactInfo
  parcel: ParcelDetails
}

export interface TaskFormData {
  // Step 1
  taskMode: "pick-and-drop" | "service-task"
  taskName: string
  taskType: string
  description: string
  // Step 2
  pickupLocation: LocationInfo
  pickupContact: ContactInfo
  // Step 3
  dropOffs: DropOff[]
}

export const TASK_TYPES = [
  { value: "express", label: "ส่งด่วน" },
  { value: "parcel", label: "งานพัสดุ" },
  { value: "document", label: "รับส่งเอกสาร" },
]

export const LOCATIONS = [
  { value: "office-bkk", label: "สำนักงานใหญ่ กรุงเทพ" },
  { value: "warehouse-sm", label: "คลังสินค้า สมุทรปราการ" },
  { value: "branch-cm", label: "สาขาเชียงใหม่" },
  { value: "branch-pk", label: "สาขาภูเก็ต" },
]

export const CONTACTS = [
  { value: "somchai", label: "สมชาย วงศ์สว่าง", phone: "081-234-5678", email: "somchai@company.com" },
  { value: "suda", label: "สุดา รักสวย", phone: "089-876-5432", email: "suda@company.com" },
  { value: "prasit", label: "ประสิทธิ์ ดีมาก", phone: "062-345-6789", email: "prasit@company.com" },
]

export const PARCEL_TYPES = [
  { value: "document", label: "เอกสาร" },
  { value: "small-box", label: "กล่องเล็ก" },
  { value: "medium-box", label: "กล่องกลาง" },
  { value: "large-box", label: "กล่องใหญ่" },
  { value: "fragile", label: "สินค้าแตกหักง่าย" },
]

export const ORGANIZATION_TYPES = [
  { value: "org-user", label: "Organization User" },
  { value: "key-contact", label: "Key Contact" },
]

export function createEmptyLocation(): LocationInfo {
  return {
    selectionMode: "list",
    selectedLocation: "",
    manualLocation: "",
    locationDescription: "",
    addressName: "",
    addressDetails: "",
    lat: null,
    lng: null,
  }
}

export function createEmptyContact(): ContactInfo {
  return {
    selectionMode: "list",
    selectedName: "",
    manualName: "",
    contactNo: "",
    email: "",
  }
}

export function createEmptyParcel(): ParcelDetails {
  return {
    parcelType: "",
    remark: "",
    imageFile: null,
    imagePreview: null,
  }
}

export function createEmptyDropOff(): DropOff {
  return {
    id: crypto.randomUUID(),
    location: createEmptyLocation(),
    contact: createEmptyContact(),
    parcel: createEmptyParcel(),
  }
}

export function createInitialFormData(): TaskFormData {
  return {
    taskMode: "pick-and-drop",
    taskName: "",
    taskType: "",
    description: "",
    pickupLocation: createEmptyLocation(),
    pickupContact: createEmptyContact(),
    dropOffs: [createEmptyDropOff()],
  }
}
