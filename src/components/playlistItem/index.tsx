/* eslint-disable @next/next/no-img-element */
import React from "react"
import Image from "next/image"
import Link from "next/link"
import IconPlay from '@/assets/images/icons/play-button.svg'
import { GetPlaylist } from "@/services/spotify"
import { useDispatch, useSelector } from "react-redux"
import { setCurrentTrack, setPlayMusic, setTrackItem, setTrackNumber, setTracks } from "@/services/redux/playlists/slice"

interface Props {
  id: string
  title: string
  description: string
  image: string
  type: string
}

export default function PlaylistItem(props: Props) {
  const [hover, setHover] = React.useState(false)
  const { currentTrack } = useSelector((r: any) => r.playlistsReducer)
  const dispatch = useDispatch()

  const handleClickPlay = async (e: any) => {
    e.preventDefault()

    await GetPlaylist(props.id).then(data => {
      dispatch(setTracks(data.tracks.items))
      dispatch(setTrackItem(data.tracks.items[0].track))
      currentTrack.load()
      currentTrack.setAttribute('src', data.tracks.items[0]?.track.preview_url)
      currentTrack.play()
      dispatch(setPlayMusic(true))
      dispatch(setTrackNumber(0))
    })
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