/* eslint-disable @next/next/no-img-element */

import Link from "next/link"

interface Props {
  id: string
  image: string
  name: string
  type: string
}

export default function ArtistItem(props: Props) {
  return (
    <Link href={`/artists/${props.id}`} className="p-10p rounded-5px hover:bg-green-10 text-center flex flex-col items-center w-40">
      <div className="rounded-full overflow-hidden w-70 h-70">
        <img src={props.image} alt="" className="w-full h-full"/>
      </div>
      <p className="mt-2 font-bold text-16">{props.name}</p>
      <p className="mt-1 font-normal text-16 text-gray-30">{props.type}</p>
    </Link>
  )
}