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
import { CheckIfUserSavedTracks, DeleteTrack, FollowTrack } from "@/services/spotify"
import { LoadingButton } from "@mui/lab"

interface Props {
  item: any
  trackNumber: number
}

export default function ItemMusic(props: Props) {
  const [actions, setActions] = React.useState(false)
  const [modalAddToPlaylists, setModalAddToPlaylist] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [liked, setLiked] = React.useState(false)

  React.useEffect(() => {
    const handleFollowedPlaylist = async () => {
      await CheckIfUserSavedTracks(props.item.track.id).then(data => setLiked(data))
    }
    handleFollowedPlaylist()
  }, [props.item.track.id])

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
      onClick: () => handleCopyShare(props.item.track.name),
      icon: ShareIcon
    }
  ]

  const handleFollowTrack = async () => {
    await FollowTrack(props.item.track.id, setLoading, setLiked)
  }

  const handleUnfollowTrack = async () => {
    await DeleteTrack(props.item.track.id, setLoading, setLiked)
  }

  return (
    <>
      <ModalAddToPlaylist open={modalAddToPlaylists} setOpen={setModalAddToPlaylist} idMusic={props.item.track.uri} name={props.item.track.name} />
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
              <img src={props.item.track.album.images[0].url} alt={props.item.track.name} />
            </div>
            <div className="">
              <p className="font-bold">{props.item.track.name}</p>
              <p className="font-normal text-gray-50">
                {props.item.track.artists.map((artist: any, key: any) => (
                  <>{artist.name}</>
                ))}
              </p>
            </div>
          </div>
        </td>
        <td className="p-2"><p className="text-gray-50">{props.item.track.album.name}</p></td>
        <td className="p-2"><p className="text-gray-50">{getDuration(props.item.track.duration_ms)}</p></td>
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