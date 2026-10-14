// app/page.tsx
import Map from '@/components/Map'

export default function Page() {
  return (
    <div>
      <Map initialCenter={[-83.75, 42.28]} initialZoom={12} />
    </div>
  )
}