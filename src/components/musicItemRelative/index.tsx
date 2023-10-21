/* eslint-disable @next/next/no-img-element */
'use client'
import Image from "next/image"
import React from "react"
import PlayIcon from '@/assets/images/icons/play-music.svg'
import { checkIfUserFollowed, handleFollow, handlePlayItem, handleUnfollow } from "@/services/spotify"
import MenuDropdown, { TMenu } from "../menuDropdown"
import ShareIcon from '@/assets/images/icons/share.svg'
import { handleCopyShare } from "@/utils/main"
import Link from "next/link"
import { LoadingButton } from "@mui/lab"
import HeartIcon from '@/assets/images/icons/heart-gray.svg'
import HeartLIcon from '@/assets/images/icons/heart-l-gray.svg'
import MenuIcon from '@/assets/images/icons/menu-points.svg'
import ModalAddToPlaylist from "../modalAddToPlaylist"
import { useSelector } from "react-redux"
import StreamLoader from "@/assets/images/icons/stream"

interface Props {
  id: string
  name: string
  uri: string
  image: string
  trackNumber: number
  artists: any
  album: any
  duration_ms: any
  className?: string
}

export default function MusicItemRelative(props: Props) {
  const { trackItem } = useSelector((r: any) => r.playlistsReducer)
  const [actions, setActions] = React.useState(false)
  const [modalAddToPlaylists, setModalAddToPlaylist] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [liked, setLiked] = React.useState(false)

  React.useEffect(() => {
    const handleFollowedPlaylist = async () => {
      await checkIfUserFollowed('me/tracks/contains', props.id).then(data => setLiked(data))
    }
    handleFollowedPlaylist()
  }, [props.id])

  const getDuration = (duration: string) => {
    const date = new Date(duration)
    const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
    const seconds = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()

    return `${minutes}:${seconds}`
  }

  const menuItems: TMenu[] = [
    {
      name: 'Add to playlist',
      onClick: () => setModalAddToPlaylist(true)
    },
    {
      name: 'Share (Copy Link)',
      onClick: () => handleCopyShare(props.uri),
      icon: ShareIcon
    }
  ]

  const handleFollowTrack = async () => {
    await handleFollow('me/tracks', props.id, 'songs', setLoading, setLiked)
  }

  const handleUnfollowTrack = async () => {
    await handleUnfollow('me/tracks', props.id, 'songs', setLoading, setLiked)
  }

  const handleClickPlay = async (e: any) => {
    e.preventDefault()

    await handlePlayItem('track', props.id as string)
  }

  return (
    <>
      <ModalAddToPlaylist open={modalAddToPlaylists} setOpen={setModalAddToPlaylist} uriMusic={props.uri} idMusic={props.id} name={props.name} />
      <div className={`cursor-pointer hover:bg-green-10 p-2 ${props.className}`} onMouseOver={() => setActions(true)} onMouseOut={() => setActions(false)}>
        <div className="flex gap-2 justify-between">
          <div className="grid grid-cols-musicItem items-center gap-1">
            <div className="w-11 h-11 overflow-hidden rounded-sm relative flex justify-center items-center">
              <img src={props.image} alt={props.name} />
              {trackItem.id === props.id ?
                <div className="w-full h-full absolute z-10 top-0 left-0 flex justify-center items-center">
                  <StreamLoader />
                </div>
                :
                actions &&
                <button className="w-full h-full absolute z-10 top-0 left-0 flex justify-center items-center" onClick={handleClickPlay}>
                  <Image src={PlayIcon} alt="play" className="w-4 h-5" />
                </button>
              }

            </div>
            <div className="truncate">
              <p className={`font-bold truncate ${trackItem.id === props.id && 'text-orange-50'}`}>{props.name}</p>
              <p className={`font-normal truncate ${trackItem.id === props.id ? 'text-orange-50' : 'text-gray-50'}`}>
                {props.artists.map((artist: any, key: any) => (
                  <Link key={key} href={`/artists/${artist.id}`} className="hover:underline">{artist.name} </Link>
                ))}
              </p>
            </div>
          </div>
          <div className="flex gap-8 items-center">
            <p className={`${trackItem.id === props.id ? 'text-orange-50' : 'text-gray-50'}`}>{getDuration(props.duration_ms)}</p>
            <div className="flex gap-3 w-60">
              {actions &&
                <>
                  {loading ?
                    <LoadingButton loading className="w-6 h-6 min-w-0" />
                    :
                    liked ?
                      <button className="w-6 h-6" onClick={handleUnfollowTrack}>
                        <Image src={HeartLIcon} alt="Heart" className="w-full h-full button-unfollow" />
                      </button>
                      :
                      <button className="w-6 h-6" onClick={handleFollowTrack}>
                        <Image src={HeartIcon} alt="Heart" className="w-full h-full" />
                      </button>
                  }
                  <MenuDropdown items={menuItems} buttonStyle="grayscale w-6 h-6" menuItemsStyle="mt-10l -right-8" button={
                    <>
                      <Image src={MenuIcon} alt="Menu" />
                    </>
                  } />
                </>
              }

            </div>
          </div>
        </div>

      </div>
    </>

  )
}