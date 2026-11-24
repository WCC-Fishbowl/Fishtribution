import { getImageKeyForCatch, getImageKeyForTaxon } from '@/lib/db'
import Image from 'next/image'

export default async function SettingsPage() {
  const catchImageKey = await getImageKeyForCatch('f63235e4-ae18-48d1-aa51-a32db1f9d68f');
  
  const taxonImageKey = await getImageKeyForTaxon('15b642b8-36f6-4c70-a87b-b54acaaa4c5f');

  return (
  <div>
    <p className="text-3xl font-bold p-4">Image Test</p>
    <p className="text-xl font-bold p-4">Catch</p>
    <Image 
      src={`/api/files/catch_photos/${encodeURIComponent(catchImageKey[0]['s3_key'] ?? '')}`} 
      alt="catch image"
      width={800}
      height={600}
    />
    <p className="text-xl font-bold p-4">Taxon</p>
    <Image 
      src={`/api/files/taxon_photos/${encodeURIComponent(taxonImageKey[0]['s3_key'] ?? '')}`} 
      alt="taxon image"
      width={800}
      height={600}
    />
  </div>
  )
}
