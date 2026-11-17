import { getImageKeyForCatch } from '@/lib/db'
import Image from 'next/image'

export default async function SettingsPage() {
  const fileKey = await getImageKeyForCatch('f63235e4-ae18-48d1-aa51-a32db1f9d68f');

  return (
  <div>
    <p className="text-3xl font-bold p-4">Image Test</p>
    <Image 
      src={`/api/files/catch_photos/${encodeURIComponent(fileKey[0]['s3_key'] ?? '')}`} 
      alt="stored image"
      width={800}
      height={600}
    />
  </div>
  )
}
