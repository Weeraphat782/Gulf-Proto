"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface MiniMapProps {
    lat: number
    lng: number
    className?: string
    zoom?: number
}

export function MiniMap({ lat, lng, className, zoom = 15 }: MiniMapProps) {
    const mapRef = useRef<HTMLDivElement>(null)
    const mapInstanceRef = useRef<L.Map | null>(null)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        if (!isMounted || !mapRef.current) return

        let mounted = true

        const initMap = async () => {
            const L = (await import("leaflet")).default
            if (!mounted || !mapRef.current) return

            // Import CSS locally for Leaflet
            // Note: Since this is inside an async function in a client component, 
            // it will load only on the client.
            await import("leaflet/dist/leaflet.css")

            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove()
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
                attributionControl: false,
                dragging: false,
                touchZoom: false,
                scrollWheelZoom: false,
                doubleClickZoom: false,
                boxZoom: false,
                keyboard: false,
            }).setView([lat, lng], zoom)
            mapInstanceRef.current = map

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map)
            L.marker([lat, lng]).addTo(map)

            // Poll invalidateSize to handle layout shifts
            let pollCount = 0
            const pollInterval = setInterval(() => {
                if (mapInstanceRef.current) {
                    mapInstanceRef.current.invalidateSize()
                }
                pollCount++
                if (pollCount >= 10) clearInterval(pollInterval)
            }, 200)
        }

        initMap()

        return () => {
            mounted = false
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove()
                mapInstanceRef.current = null
            }
        }
    }, [lat, lng, zoom, isMounted])

    if (!isMounted) {
        return <div className={cn("h-full w-full bg-muted animate-pulse", className)} />
    }

    return (
        <div
            ref={mapRef}
            className={cn("relative h-full w-full overflow-hidden", className)}
            style={{ pointerEvents: 'none', zIndex: 0, isolation: 'isolate', minHeight: '100px' }}
        />
    )
}
