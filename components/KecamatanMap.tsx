'use client'

import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import type { LatLngExpression } from 'leaflet'

// react-leaflet hanya client-side
const MapContainer = dynamic(
  () => import('react-leaflet').then(m => m.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then(m => m.TileLayer),
  { ssr: false }
)
const GeoJSON = dynamic(
  () => import('react-leaflet').then(m => m.GeoJSON),
  { ssr: false }
)

// contoh GeoJSON sederhana (ganti nanti dengan boundary desa-desa)
const sampleGeoJson = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'Desa A' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [107.6, -7.75],
            [107.62, -7.75],
            [107.62, -7.73],
            [107.6, -7.73],
            [107.6, -7.75]
          ]
        ]
      }
    },
    {
      type: 'Feature',
      properties: { name: 'Desa B' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [107.62, -7.75],
            [107.64, -7.75],
            [107.64, -7.73],
            [107.62, -7.73],
            [107.62, -7.75]
          ]
        ]
      }
    }
  ]
}

export default function KecamatanMap() {
  // pusat peta (perkirakan koordinat pusat kecamatanmu)
  const center: LatLngExpression = useMemo(() => [-7.74, 107.62], [])

  const style = {
    weight: 2,
    color: '#10b981',
    fillColor: '#10b981',
    fillOpacity: 0.15
  }

  return (
    <div className="overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5">
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: 260, width: '100%' }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON data={sampleGeoJson as any} style={() => style} />
      </MapContainer>
    </div>
  )
}
