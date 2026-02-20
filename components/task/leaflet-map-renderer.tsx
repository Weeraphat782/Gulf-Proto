"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { MapPin, Search, Loader2, Pencil, LocateFixed } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import "leaflet/dist/leaflet.css"

interface LeafletMapRendererProps {
    initialLat: number
    initialLng: number
    onConfirm: (lat: number, lng: number, address: string, details: string) => void
    onCancel: () => void
    title?: string
}

export default function LeafletMapRenderer({
    initialLat,
    initialLng,
    onConfirm,
    onCancel,
    title = "Select Location (Pick-up Location)",
}: LeafletMapRendererProps) {
    const [lat, setLat] = useState(initialLat)
    const [lng, setLng] = useState(initialLng)
    const [searchQuery, setSearchQuery] = useState("")
    const [isSearching, setIsSearching] = useState(false)
    const [addressName, setAddressName] = useState("")
    const [addressDetails, setAddressDetails] = useState("")

    const mapRef = useRef<HTMLDivElement>(null)
    const mapInstanceRef = useRef<L.Map | null>(null)
    const markerRef = useRef<L.Marker | null>(null)

    const reverseGeocode = useCallback(async (latitude: number, longitude: number) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
            )
            const data = await response.json()
            if (data) {
                setAddressName(data.name || data.display_name.split(",")[0] || "Address Name")
                setAddressDetails(data.display_name || "")
            }
        } catch (err) {
            console.error("Reverse geocode failed:", err)
        }
    }, [])

    useEffect(() => {
        reverseGeocode(initialLat, initialLng)
    }, [initialLat, initialLng, reverseGeocode])

    useEffect(() => {
        if (!mapRef.current) return

        let isMounted = true

        const initMap = async () => {
            const L = (await import("leaflet")).default

            if (!isMounted || !mapRef.current) return

            // Clean up previous instance
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove()
                mapInstanceRef.current = null
            }

            // Fix icon issues
            delete (L.Icon.Default.prototype as any)._getIconUrl
            L.Icon.Default.mergeOptions({
                iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
                iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
                shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            })

            const map = L.map(mapRef.current, {
                zoomControl: false,
            }).setView([initialLat, initialLng], 15)
            mapInstanceRef.current = map

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: "&copy; OpenStreetMap contributors",
            }).addTo(map)

            // Add zoom control manually to position it bottom right
            L.control.zoom({ position: "bottomright" }).addTo(map)

            const marker = L.marker([initialLat, initialLng], {
                draggable: true,
            }).addTo(map)
            markerRef.current = marker

            marker.on("dragend", () => {
                const pos = marker.getLatLng()
                setLat(pos.lat)
                setLng(pos.lng)
                reverseGeocode(pos.lat, pos.lng)
            })

            map.on("click", (e: L.LeafletMouseEvent) => {
                marker.setLatLng(e.latlng)
                setLat(e.latlng.lat)
                setLng(e.latlng.lng)
                reverseGeocode(e.latlng.lat, e.latlng.lng)
            })

            // Frequent invalidation to handle Dialog transition
            const interval = setInterval(() => {
                map.invalidateSize()
            }, 100)
            setTimeout(() => clearInterval(interval), 1000)
        }

        initMap()

        return () => {
            isMounted = false
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove()
                mapInstanceRef.current = null
            }
        }
    }, [initialLat, initialLng, reverseGeocode])

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!searchQuery.trim()) return

        setIsSearching(true)
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
            )
            const data = await response.json()
            if (data && data.length > 0) {
                const { lat: newLat, lon: newLng } = data[0]
                const latNum = parseFloat(newLat)
                const lngNum = parseFloat(newLng)
                setLat(latNum)
                setLng(lngNum)

                if (mapInstanceRef.current && markerRef.current) {
                    mapInstanceRef.current.setView([latNum, lngNum], 16)
                    markerRef.current.setLatLng([latNum, lngNum])
                    reverseGeocode(latNum, lngNum)
                }
            }
        } catch (error) {
            console.error("Search failed:", error)
        } finally {
            setIsSearching(false)
        }
    }

    const handleLocateMe = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords
                setLat(latitude)
                setLng(longitude)
                if (mapInstanceRef.current && markerRef.current) {
                    mapInstanceRef.current.setView([latitude, longitude], 16)
                    markerRef.current.setLatLng([latitude, longitude])
                    reverseGeocode(latitude, longitude)
                }
            })
        }
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Search Header */}
            <div className="flex gap-2">
                <form onSubmit={handleSearch} className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search area or address..."
                        className="pl-10 h-10 border-[#E5E5E5] bg-[#F8F9FA]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </form>
                <Button
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="bg-[#2E3192] text-white hover:bg-[#24276E] px-8 h-10"
                >
                    {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
                </Button>
            </div>

            {/* Map Container */}
            <div className="relative overflow-hidden rounded-lg border border-[#E5E5E5]">
                <div
                    ref={mapRef}
                    className="h-[400px] w-full"
                    style={{ zIndex: 0 }}
                />

                {/* Locate Me Button Overlay */}
                <button
                    onClick={handleLocateMe}
                    className="absolute bottom-20 right-3 z-[400] rounded-md bg-white p-2 shadow-md hover:bg-gray-50 text-[#666]"
                >
                    <LocateFixed className="h-5 w-5" />
                </button>
            </div>

            {/* Address Fields (matching screenshot) */}
            <div className="space-y-3">
                <div className="relative">
                    <div className="flex items-center gap-3 rounded-md border border-[#E5E5E5] bg-white p-3">
                        <div className="rounded-full bg-red-100 p-1.5">
                            <MapPin className="h-4 w-4 text-red-500 fill-red-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#2E3192]/80">
                                Address Name
                            </span>
                            <p className="mt-0.5 truncate text-sm font-semibold text-foreground">{addressName}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Pencil className="h-4 w-4 text-blue-900" />
                        </Button>
                    </div>
                </div>

                <div className="relative">
                    <div className="flex items-start gap-3 rounded-md border border-[#E5E5E5] bg-white p-3">
                        <div className="flex-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#2E3192]/80">
                                Address Details
                            </span>
                            <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                                {addressDetails || "No address details available"}
                            </p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Pencil className="h-4 w-4 text-blue-900" />
                        </Button>
                    </div>
                </div>
            </div>

            <p className="text-center text-[10px] text-muted-foreground">
                Latitude: {lat.toFixed(6)}, Longitude: {lng.toFixed(6)}
            </p>

            {/* Footer Buttons */}
            <div className="flex justify-between items-center gap-3 mt-2">
                <Button
                    variant="ghost"
                    onClick={onCancel}
                    className="text-foreground uppercase font-bold text-xs h-10 px-6 bg-gray-100/50 hover:bg-gray-100"
                >
                    CANCEL
                </Button>
                <Button
                    onClick={() => onConfirm(lat, lng, addressName, addressDetails)}
                    className="bg-[#2E3192] text-white hover:bg-[#24276E] uppercase font-bold text-xs h-10 px-12"
                >
                    SUBMIT
                </Button>
            </div>
        </div>
    )
}
