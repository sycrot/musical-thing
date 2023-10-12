/* eslint-disable @next/next/no-img-element */
import React from "react"
import Image from "next/image"
import Link from "next/link"
import IconPlay from '@/assets/images/icons/play-button.svg'

interface Props {
  id: string
  title: string
  description: string
  image: string
  type: string
}

export default function PlaylistItem(props: Props) {
  const [hover, setHover] = React.useState(false)

  const handleClickPlay = (e: any) => {
    e.preventDefault()
  }

  return (
    <Link href={`/${props.type}/${props.id}`} className="p-10p rounded-4px hover:bg-green-10 block max-w-190" onMouseOver={() => setHover(true)} onMouseOut={() => setHover(false)}>
      <div className="rounded-4px overflow-hidden relative">
        <img src={props.image} alt={props.title} className="w-full h-full" />
        {hover &&
          <button className="absolute bottom-2 right-2 w-11 h-11 animate-buttonPlaylist z-10" onClick={e => handleClickPlay(e)}>
            <Image src={IconPlay} alt="Play" className="w-full h-full" />
          </button>
        }

      </div>
      <div className="mt-10p truncate">
        <p className="font-bold text-16 truncate">{props.title}</p>
        <p className="text-14 truncate">{props.description}</p>
      </div>
    </Link>
  )
}