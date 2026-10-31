import Image from 'next/image'

export default async function SettingsPage() {
  const fileKey = 'bluegill.jpg'
  return (
  <div>
    <p className="text-3xl font-bold p-4">Settings</p>
    <Image 
      src={`/api/files/${encodeURIComponent(fileKey)}`} 
      alt="stored image"
      width={800}
      height={600}
    />
  </div>
  )
}