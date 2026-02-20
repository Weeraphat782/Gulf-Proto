"use client"

import { useEffect, useRef, useState, useCallback, useMemo } from "react"
import dynamic from "next/dynamic"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { MapPin } from "lucide-react"

// Dynamically import the map renderer with SSR disabled
const LeafletMapRenderer = dynamic(
  () => import("./leaflet-map-renderer"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[600px] w-full flex items-center justify-center bg-muted animate-pulse rounded-lg">
        <p className="text-sm text-muted-foreground">Loading Map...</p>
      </div>
    )
  }
)

interface MapPickerProps {
  lat: number | null
  lng: number | null
  addressName?: string
  addressDetails?: string
  onSelect: (lat: number, lng: number, addressName: string, addressDetails: string) => void
  label?: string
}

const DEFAULT_LAT = 13.7563
const DEFAULT_LNG = 100.5018

export function MapPicker({
  lat,
  lng,
  addressName: initialAddressName = "",
  addressDetails: initialAddressDetails = "",
  onSelect,
  label = "Select the pick up location",
}: MapPickerProps) {
  const [open, setOpen] = useState(false)
  const [addressName, setAddressName] = useState(initialAddressName)
  const [addressDetails, setAddressDetails] = useState(initialAddressDetails)

  // Sync state with props when they change externally (e.g. from master data selection)
  useEffect(() => {
    if (initialAddressName) setAddressName(initialAddressName)
    if (initialAddressDetails) setAddressDetails(initialAddressDetails)
  }, [initialAddressName, initialAddressDetails])

  // Ref for inline preview map (using vanilla leaflet for lightweight preview)
  const previewMapRef = useRef<HTMLDivElement>(null)
  const previewMapInstanceRef = useRef<L.Map | null>(null)

  const hasPin = lat !== null && lng !== null
  const displayLat = lat ?? DEFAULT_LAT
  const displayLng = lng ?? DEFAULT_LNG

  // Reverse geocode to get address for inline display
  const reverseGeocode = useCallback(async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
      )
      const data = await response.json()
      if (data && data.display_name) {
        const parts = data.display_name.split(", ")
        setAddressName(data.name || parts.slice(0, 1)[0] || "Address Name")
        setAddressDetails(data.display_name)
      }
    } catch {
      setAddressName(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`)
      setAddressDetails("")
    }
  }, [])

  useEffect(() => {
    // Only reverse geocode if coordinates are present AND we don't have specific initial metadata
    // or if the coordinates changed and they differ from the initial ones.
    if (hasPin && (!initialAddressName || !initialAddressDetails)) {
      reverseGeocode(lat, lng)
    }
  }, [lat, lng, hasPin, reverseGeocode, initialAddressName, initialAddressDetails])

  // ─── Inline Preview Map ───
  useEffect(() => {
    let isMounted = true

    const initPreviewMap = async () => {
      if (!previewMapRef.current) return

      const L = (await import("leaflet")).default
      if (!isMounted || !previewMapRef.current) return

      // Cleanup
      if (previewMapInstanceRef.current) {
        previewMapInstanceRef.current.remove()
      }

      // Fix icon issues once
      if (!(L.Icon.Default.prototype as any)._fixed) {
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        })
          ; (L.Icon.Default.prototype as any)._fixed = true
      }

      const map = L.map(previewMapRef.current, {
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        touchZoom: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
      }).setView([displayLat, displayLng], 15)
      previewMapInstanceRef.current = map

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map)

      if (hasPin) {
        const customIcon = L.icon({
          iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });
        L.marker([displayLat, displayLng], { icon: customIcon }).addTo(map)
      }

      // Polling to handle potential container resize
      let pollCount = 0
      const pollInterval = setInterval(() => {
        if (previewMapInstanceRef.current) {
          previewMapInstanceRef.current.invalidateSize()
        }
        pollCount++
        if (pollCount >= 10) clearInterval(pollInterval)
      }, 200)
    }

    initPreviewMap()

    return () => {
      isMounted = false
      if (previewMapInstanceRef.current) {
        previewMapInstanceRef.current.remove()
        previewMapInstanceRef.current = null
      }
    }
  }, [displayLat, displayLng, hasPin])

  const handleConfirm = (newLat: number, newLng: number, name: string, details: string) => {
    onSelect(newLat, newLng, name, details)
    setOpen(false)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative w-full cursor-pointer overflow-hidden rounded-xl border border-[#E5E5E5] bg-white text-left transition-shadow hover:shadow-md"
        style={{ zIndex: 0, isolation: "isolate" }}
      >
        <div
          ref={previewMapRef}
          className="h-[180px] w-full"
          style={{ pointerEvents: "none", height: "180px", minHeight: "180px" }}
        />

        {!hasPin && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
            <div className="flex items-center gap-2 rounded-full bg-white/90 px-5 py-2.5 text-sm font-semibold text-[#2E3192] shadow-md backdrop-blur-sm">
              <MapPin className="h-4 w-4" />
              {label}
            </div>
          </div>
        )}

        {hasPin && (
          <div className="flex items-start gap-3 border-t border-[#E5E5E5] px-4 py-3">
            <div className="rounded-full bg-red-100 p-1.5 shrink-0">
              <MapPin className="h-4 w-4 text-red-500 fill-red-500" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-[#2E3192]">
                {addressName || "Address Name"}
              </p>
              <p className="line-clamp-2 text-xs text-muted-foreground whitespace-normal">
                {addressDetails || `${lat.toFixed(4)}, ${lng.toFixed(4)}`}
              </p>
            </div>
          </div>
        )}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl sm:max-w-4xl p-0 overflow-hidden border-none bg-transparent shadow-none">
          <div className="bg-white rounded-xl p-6 shadow-2xl">
            <div className="mb-4">
              <span className="text-sm font-bold text-[#2E3192] border-b-2 border-[#2E3192] pb-1">
                Select Location (Pick-up Location)
              </span>
            </div>

            <LeafletMapRenderer
              initialLat={lat ?? DEFAULT_LAT}
              initialLng={lng ?? DEFAULT_LNG}
              onConfirm={handleConfirm}
              onCancel={() => setOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

