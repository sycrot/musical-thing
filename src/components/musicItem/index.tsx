/* eslint-disable @next/next/no-img-element */
'use client'
import Image from "next/image"
import React, { useRef } from "react"
import HeartIcon from '@/assets/images/icons/heart-gray.svg'
import HeartLIcon from '@/assets/images/icons/heart-l-gray.svg'
import MenuIcon from '@/assets/images/icons/menu-points.svg'
import PlayIcon from '@/assets/images/icons/play-music.svg'
import ShareIcon from '@/assets/images/icons/share.svg'
import MenuDropdown, { TMenu } from "../menuDropdown"
import { handleCopyShare } from "@/utils/main"
import ModalAddToPlaylist from "../modalAddToPlaylist"
import { GetAlbum, GetPlaylist, checkIfUserFollowed, getUserPlaylistLikedMusics, handleFollow, handlePlayItem, handleRemovePlaylistItem, handleUnfollow } from "@/services/spotify"
import { LoadingButton } from "@mui/lab"
import Link from "next/link"
import { setCurrentPlaylistId, setPlayMusic, setTrackNumber, setTracksPlaylist } from "@/services/redux/playlists/slice"
import { useDispatch, useSelector } from "react-redux"
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
  idPlaylist?: string
  typePlaylist: string
  trackUri: string
  playlistName?: string
  reload?: boolean
}

export default function ItemMusic(props: Props) {
  const { user } = useSelector((r: any) => r.userReducer)
  const { userPlaylists, trackItem } = useSelector((r: any) => r.playlistsReducer)
  const [actions, setActions] = React.useState(false)
  const [modalAddToPlaylists, setModalAddToPlaylist] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [liked, setLiked] = React.useState(false)
  const [removeTrack, setRemoveTrack] = React.useState(false)
  const dispatch = useDispatch()

  const handleFollowedTrack = React.useCallback(async () => {
    await checkIfUserFollowed('me/tracks/contains', props.id).then(data => setLiked(data))
  }, [props.id])

  const handleCheckUserPlaylist = React.useCallback(() => {
    let list: any = []

    userPlaylists?.map((item: any) => {
      if (item.owner.id === user.id) {
        list.push(item)
      }
    })

    const listFilter = list.some((el: any) => el.id === props.idPlaylist)

    setRemoveTrack(!listFilter)
  }, [props.idPlaylist, user?.id, userPlaylists])

  React.useEffect(() => {
    handleFollowedTrack()
    handleCheckUserPlaylist()
  }, [handleFollowedTrack, handleCheckUserPlaylist])

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
      onClick: () => handleCopyShare(window.location.href),
      icon: ShareIcon
    },
    {
      name: 'Remove track',
      onClick: () => handleUnfollowTrackFromPlaylist(),
      remove: removeTrack
    },
  ]

  const handleFollowTrack = async () => {
    await handleFollow('me/tracks', props.id, 'songs', setLoading, setLiked)
  }

  const handleUnfollowTrack = async () => {
    await handleUnfollow('me/tracks', props.id, 'songs', setLoading, setLiked).then(() => {
      if (props.reload) {
        window.location.reload()
      }
    })
  }

  const handleUnfollowTrackFromPlaylist = async () => {
    if (props.idPlaylist) {
      await handleRemovePlaylistItem(props.idPlaylist, props.playlistName || '', props.trackUri).then(() => {
        window.location.reload()
      })
    }
  }

  const handleClickPlay = async (e: any) => {
    e.preventDefault()

    switch (props.typePlaylist) {
      case 'playlist':
        if (props.idPlaylist) {
          await GetPlaylist(props.idPlaylist).then(data => {
            dispatch(setCurrentPlaylistId(props.idPlaylist))
            dispatch(setTracksPlaylist(data.tracks.items))

            const filterTrack = data.tracks.items.findIndex((el: any) => el.track.id === props.id)

            dispatch(setTrackNumber(filterTrack))
            dispatch(setPlayMusic(true))
          })
        }
        break;
      case 'album':
        if (props.idPlaylist) {
          await GetAlbum(props.idPlaylist).then(data => {
            dispatch(setCurrentPlaylistId(props.idPlaylist))
            dispatch(setTracksPlaylist(data.tracks.items))
            const filterTrack = data.tracks.items.findIndex((el: any) => el.id === props.id)
            dispatch(setTrackNumber(filterTrack))
            dispatch(setPlayMusic(true))
          })
        }
        break;
      case 'track':
        await handlePlayItem('track', props.id as string)
        break;
      case 'favorites':
        await getUserPlaylistLikedMusics().then(data => {
          dispatch(setCurrentPlaylistId(null))
          dispatch(setTracksPlaylist(data))
          const filterTrack = data.findIndex((el: any) => el.track.id === props.id)
          dispatch(setTrackNumber(filterTrack))
          dispatch(setPlayMusic(true))
        })
        break;
    }

  }

  return (
    <>
      <ModalAddToPlaylist open={modalAddToPlaylists} setOpen={setModalAddToPlaylist} uriMusic={props.uri} idMusic={props.id} name={props.name} />
      <tr className="cursor-pointer hover:bg-green-10" onMouseOver={() => setActions(true)} onMouseOut={() => setActions(false)}>
        <td className="pl-5 rounded-tl-5px rounded-bl-5px">
          {trackItem?.id === props.id ?
            <StreamLoader />
            :
            actions ?
              <button onClick={handleClickPlay}><Image src={PlayIcon} alt="play" /></button>
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
              <p className={`font-bold truncate ${trackItem?.id === props.id && 'text-orange-50'}`}>{props.name}</p>
              <p className={`font-normal truncate ${trackItem?.id === props.id ? 'text-orange-50' : 'text-gray-50'}`}>
                {props.artists.map((artist: any, key: any) => (
                  <Link key={key} href={`/artists/${artist.id}`} className="hover:underline">{artist.name} </Link>
                ))}
              </p>
            </div>
          </div>
        </td>
        <td className="p-2">
          <Link href={`/album/${props.album.id}`} className="hover:underline">
            <p className={`${trackItem?.id === props.id ? 'text-orange-50' : 'text-gray-50'}`}>{props.album.name}</p>
          </Link>
        </td>
        <td className="p-2">
          <p className={`${trackItem?.id === props.id ? 'text-orange-50' : 'text-gray-50'}`}>{getDuration(props.duration_ms)}</p></td>
        <td className="p-2 px-4 rounded-tr-5px rounded-br-5px">
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
        </td>
      </tr>
    </>

  )
}