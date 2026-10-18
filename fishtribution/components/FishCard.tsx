/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'

export type Fish = {
  id: string
  name: string
  description: string
  image: string
}

// Wide card: image on one side, text on the other
export function FishRow({ fish, imageSide }: { fish: Fish; imageSide: 'left' | 'right' }) {
  return (
    <div className={`flex gap-3 ${imageSide === 'right' ? 'flex-row-reverse' : ''}`}>
      <img
        src={fish.image}
        alt={fish.name}
        className={`h-24 w-32 shrink-0 rounded-md object-cover ${
          imageSide === 'left'
            ? 'shadow-[inset_5px_4px_4px_0px_rgba(0,0,0,0.25)]'
            : 'shadow-[inset_-5px_4px_4px_0px_rgba(0,0,0,0.25)]'
        }`}
      />
      <div className="flex flex-1 flex-col">
        <h3 className="font-title text-2xl font-bold leading-8 text-slate-700">{fish.name}</h3>
        <p className="text-[10px] leading-5 text-slate-400">{fish.description}</p>
        <Link href={`/explore/${fish.id}`} className="mt-auto self-end text-[10px] font-bold text-black">
          More
        </Link>
      </div>
    </div>
  )
}

// Compact card: image and text panel stacked, either order
export function FishTile({ fish, imagePosition }: { fish: Fish; imagePosition: 'top' | 'bottom' }) {
  return (
    <div
      className={`flex overflow-hidden rounded-md shadow-[6px_7px_4px_0px_rgba(0,0,0,0.25)] ${
        imagePosition === 'top' ? 'flex-col' : 'flex-col-reverse'
      }`}
    >
      <img src={fish.image} alt={fish.name} className="h-24 w-full object-cover" />
      <div className="relative h-24 bg-white p-2">
        <h3 className="font-title text-xs font-bold text-slate-700">{fish.name}</h3>
        <p className="mt-1 line-clamp-4 text-[7px] leading-3 text-slate-400">{fish.description}</p>
        <Link href={`/explore/${fish.id}`} className="absolute bottom-1 right-2 text-[8px] font-bold text-black">
          More
        </Link>
      </div>
    </div>
  )
}