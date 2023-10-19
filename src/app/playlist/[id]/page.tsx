/* eslint-disable @next/next/no-img-element */
'use client'
import React, { useRef } from "react"
import NavigateBackButton from "@/components/navigateBackButton"
import { useParams, usePathname } from "next/navigation"
import { CheckIfUserFollowPlaylist, DeleteUserPlaylist, FollowPlaylist, GetPlaylist, handlePlayItem } from "@/services/spotify"
import Image from "next/image"
import ButtonPlayIcon from '@/assets/images/icons/play-button.svg'
import HeartIcon from '@/assets/images/icons/heart-l-white.svg'
import HeartLIcon from '@/assets/images/icons/heart.svg'
import ShareIcon from '@/assets/images/icons/share-white.svg'
import ItemMusic from "@/components/musicItem"
import { handleAnimationButtonLike, handleCopyShare } from "@/utils/main"
import { LoadingButton } from "@mui/lab"
import { Skeleton } from '@mui/material'
import { useSelector } from "react-redux"

export const HandleSkeletonPlaylist = () => {
  return (
    <>
      <div className="px-5 pt-20 pb-10">
        <div className="mt-16">
          <div className="flex items-center gap-2">
            <Skeleton variant="rounded" width={170} height={170} />
            <div className="">
              <Skeleton variant="rounded" width={220} height={60} />
              <Skeleton variant="rounded" width={470} height={24} className="mt-2" />
            </div>
          </div>
        </div>
      </div>
      <div className="px-5 mt-10">
        {
          Array(5).fill('skeleton').map((item, index) => (
            <div key={index} className="flex gap-1 mt-4">
              <Skeleton variant="rounded" height={64} className="w-full" />
            </div>
          ))
        }
      </div>
    </>

  )
}

export default function Playlist() {
  const { id } = useParams()
  const { user } = useSelector((r: any) => r.userReducer)
  const { userPlaylists } = useSelector((r: any) => r.playlistsReducer)
  const [playlist, setPlaylist] = React.useState<any>(undefined)
  const [tracks, setTracks] = React.useState<[]>([])
  const [followed, setFollowed] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [ofUser, setOfUser] = React.useState(false)
  const buttonUnfollow = React.useRef<any>(null)

  const handleTracks = React.useCallback(async () => {
    if (user) {
      await GetPlaylist(id as string).then(data => {
        setPlaylist(data)
        setTracks(data.tracks.items)
      })
    }
  }, [id, user])

  const handleFollowedPlaylist = React.useCallback(async () => {
    await CheckIfUserFollowPlaylist(id as string).then(data => setFollowed(data))
  }, [id])

  const handleCheckUserPlaylist = React.useCallback(() => {
    let list: any = []

    userPlaylists?.map((item: any) => {
      if (item.owner.id === user.id) {
        list.push(item)
      }
    })

    const listFilter = list.some((el: any) => el.id === id)

    setOfUser(listFilter)
  }, [id, user?.id, userPlaylists])

  React.useEffect(() => {
    handleTracks()
    handleFollowedPlaylist()
    handleCheckUserPlaylist()
  }, [handleFollowedPlaylist, handleTracks, handleCheckUserPlaylist])

  const handleFollowPlaylist = async () => {
    await FollowPlaylist(id as string, setLoading, setFollowed).then(() => {
      setTimeout(() => {
        handleAnimationButtonLike(buttonUnfollow)
      }, 100)
    })
  }

  const handleUnfollowPlaylist = async () => {
    await DeleteUserPlaylist(id as string, setLoading, setFollowed)
  }

  const handleClickPlay = async (e: any) => {
    e.preventDefault()

    await handlePlayItem(id as string, 'playlist')
  }

  const handleBgColor = () => {
    const color = playlist.primary_color?.toLowerCase()
    if (color === '#ffffff' || playlist.primary_color === null) {
      return '#497174'
    } else {
      return playlist.primary_color
    }
  }

  return (
    <>
      {playlist ?
        <div className="px-5 pt-20 pb-10" style={{ background: `linear-gradient(${handleBgColor()} 0%, transparent 500px)` }}>
          <div className="w-full">
            <NavigateBackButton />
          </div>
          <div className="grid grid-cols-playlistPage w-full mt-5 gap-4">
            <div className="w-170 h-170 overflow-hidden rounded-5px">
              <img src={playlist.images[0]?.url} alt={playlist.name} className="object-cover w-full h-full" />
            </div>
            <div className="text-white flex flex-col justify-center truncate">
              <h1 className="font-bold text-40 text-shadow-sm shadow-gray-60 truncate">{playlist.name}</h1>
              <p className="truncate text-shadow-sm shadow-gray-60">{playlist.description}</p>
              <p className="text-14 mt-6 text-shadow-sm shadow-gray-60">Made by <b>{playlist.owner.display_name}</b> • {playlist.tracks.items.length} Songs</p>
            </div>
          </div>
          <div className="flex gap-5 mt-7 items-center">
            <button onClick={handleClickPlay}>
              <Image src={ButtonPlayIcon} alt="play" />
            </button>
            {loading ?
              <LoadingButton loading className="w-9 h-9 min-w-0" />
              :
              !ofUser &&
              <>
                {
                  followed ?
                    <button onClick={handleUnfollowPlaylist} className="w-9 h-9 relative">
                      <Image src={HeartLIcon} alt="heart" className="w-full h-full" ref={buttonUnfollow}/>
                    </button>
                    :
                    <button onClick={handleFollowPlaylist} className="w-9 h-9 relative">
                      <Image src={HeartIcon} alt="heart" className="w-full h-full drop-shadow-icon" />
                    </button>
                }
              </>

            }


            <button onClick={() => handleCopyShare(window.location.href)}>
              <Image src={ShareIcon} alt="share" className="drop-shadow-icon" />
            </button>
          </div>
          <div className="mt-12">
            <table className="text-left border-separate border-spacing-0 w-full">
              <thead>
                <tr>
                  <th className="p-2"></th>
                  <th className="p-2">Title</th>
                  <th className="p-2">Album</th>
                  <th className="p-2">Duration</th>
                  <th className="p-2"></th>
                </tr>
              </thead>
              <tbody>
                {tracks.map((item: any, key) => (
                  <ItemMusic key={key} trackNumber={key + 1} id={item.track.id} name={item.track.name} uri={item.track.uri} image={item.track.album.images[0]?.url} artists={item.track.artists} album={item.track.album} duration_ms={item.track.duration_ms} idPlaylist={id as string} typePlaylist="playlist" trackUri={item.track.uri} playlistName={playlist.name} />
                ))}

              </tbody>
            </table>
          </div>
        </div >
        :
        <HandleSkeletonPlaylist />
      }
    </>
  )
}