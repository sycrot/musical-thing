/* eslint-disable @next/next/no-img-element */
'use client'
import Image from "next/image"
import React from "react"
import HeartIcon from '@/assets/images/icons/heart-gray.svg'
import HeartLIcon from '@/assets/images/icons/heart-l-gray.svg'
import MenuIcon from '@/assets/images/icons/menu-points.svg'
import PlayIcon from '@/assets/images/icons/play-music.svg'
import ShareIcon from '@/assets/images/icons/share.svg'
import MenuDropdown, { TMenu } from "../menuDropdown"
import { handleCopyShare } from "@/utils/main"
import ModalAddToPlaylist from "../modalAddToPlaylist"
import { checkIfUserFollowed, handleFollow, handleUnfollow } from "@/services/spotify"
import { LoadingButton } from "@mui/lab"
import Link from "next/link"

interface Props {
  id: string
  name: string
  uri: string
  image: string
  trackNumber: number
  artists: any
  album: any
  duration_ms: any
}

export default function ItemMusic(props: Props) {
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
      onClick: () => handleCopyShare(props.name),
      icon: ShareIcon
    }
  ]

  const handleFollowTrack = async () => {
    await handleFollow('me/tracks', props.id, 'songs', setLoading, setLiked)
  }

  const handleUnfollowTrack = async () => {
    await handleUnfollow('me/tracks', props.id, 'songs', setLoading, setLiked)
  }

  return (
    <>
      <ModalAddToPlaylist open={modalAddToPlaylists} setOpen={setModalAddToPlaylist} idMusic={props.uri} name={props.name} />
      <tr className="cursor-pointer hover:bg-green-10" onMouseOver={() => setActions(true)} onMouseOut={() => setActions(false)}>
        <td className="pl-5 rounded-tl-5px rounded-bl-5px">
          {actions ?
            <Image src={PlayIcon} alt="play" />
            :
            <p className="text-gray-50 w-15p">{props.trackNumber}</p>
          }

        </td>
        <td className="p-2">
          <div className="grid grid-cols-musicItem items-center gap-1">
            <div className="col-span-1 w-11 h-11 overflow-hidden rounded-sm">
              <img src={props.image} alt={props.name} />
            </div>
            <div className="truncate">
              <p className="font-bold truncate">{props.name}</p>
              <p className="font-normal text-gray-50 truncate">
                {props.artists.map((artist: any, key: any) => (
                  <Link key={key} href={`/artists/${artist.id}`} className="hover:underline">{artist.name} </Link>
                ))}
              </p>
            </div>
          </div>
        </td>
        <td className="p-2"><Link href={`/album/${props.album.id}`} className="hover:underline"><p className="text-gray-50">{props.album.name}</p></Link></td>
        <td className="p-2"><p className="text-gray-50">{getDuration(props.duration_ms)}</p></td>
        <td className="p-2 px-4 rounded-tr-5px rounded-br-5px">
          <div className="flex gap-3 w-60">
            {actions &&
              <>
                {loading ?
                  <LoadingButton loading className="w-6 h-6 min-w-0" />
                  :
                  liked ?
                    <button className="w-6 h-6" onClick={handleUnfollowTrack}>
                      <Image src={HeartLIcon} alt="Heart" className="w-full h-full" />
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
        </td>
      </tr>
    </>

  )
}