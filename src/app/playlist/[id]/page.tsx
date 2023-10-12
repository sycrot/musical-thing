/* eslint-disable @next/next/no-img-element */
'use client'
import React from "react"
import NavigateBackButton from "@/components/navigateBackButton"
import { useParams, usePathname } from "next/navigation"
import { CheckIfUserFollowPlaylist, DeleteUserPlaylist, FollowPlaylist, GetPlaylist } from "@/services/spotify"
import Image from "next/image"
import ButtonPlayIcon from '@/assets/images/icons/play-button.svg'
import HeartIcon from '@/assets/images/icons/heart-l-white.svg'
import HeartLIcon from '@/assets/images/icons/heart.svg'
import ShareIcon from '@/assets/images/icons/share-white.svg'
import ItemMusic from "@/components/musicItem"
import { handleCopyShare } from "@/utils/main"
import { LoadingButton } from "@mui/lab"

export default function Playlist() {
  const { id } = useParams()
  const [playlist, setPlaylist] = React.useState<any>(undefined)
  const [tracks, setTracks] = React.useState<[]>([])
  const [followed, setFollowed] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const routerPathname = usePathname()

  const handleTracks = React.useCallback(async () => {
    await GetPlaylist(id as string).then(data => {
      setPlaylist(data)
      setTracks(data.tracks.items)
    })
  }, [id])

  const handleFollowedPlaylist = React.useCallback(async () => {
    await CheckIfUserFollowPlaylist(id as string).then(data => setFollowed(data))
  }, [id])

  React.useEffect(() => {
    handleTracks()
    handleFollowedPlaylist()
  }, [handleFollowedPlaylist, handleTracks])

  const handleFollowPlaylist = async () => {
    await FollowPlaylist(id as string, setLoading, setFollowed)
  }

  const handleUnfollowPlaylist = async () => {
    await DeleteUserPlaylist(id as string, setLoading, setFollowed)
  }

  return (
    <>
      {playlist &&
        <div className="px-5 pt-20 pb-10" style={{ background: `linear-gradient(${playlist.primary_color && playlist.primary_color !== '#ffffff' ? playlist.primary_color : '#497174'} 0%, transparent 500px)` }}>
          <div className="w-full">
            <NavigateBackButton />
          </div>
          <div className="flex w-full mt-5 gap-5">
            <div className="w-170 h-170 overflow-hidden rounded-5px">
              <img src={playlist.images[0].url} alt={playlist.name} className="object-cover w-full h-full" />
            </div>
            <div className="text-white flex flex-col justify-center truncate">
              <h1 className="font-bold text-40">{playlist.name}</h1>
              <p className="truncate">{playlist.description}</p>
              <p className="text-14 mt-6">Made by <b>{playlist.owner.display_name}</b> • {playlist.tracks.items.length} Songs</p>
            </div>
          </div>
          <div className="flex gap-5 mt-7 items-center">
            <button>
              <Image src={ButtonPlayIcon} alt="play" />
            </button>
            {loading ?
              <LoadingButton loading className="w-9 h-9 min-w-0" />
              :
              followed ?
                <button onClick={handleUnfollowPlaylist} className="w-9 h-9">
                  <Image src={HeartLIcon} alt="heart" className="w-full h-full" />
                </button>
                :
                <button onClick={handleFollowPlaylist} className="w-9 h-9">
                  <Image src={HeartIcon} alt="heart" className="w-full h-full" />
                </button>
            }


            <button onClick={() => handleCopyShare(routerPathname)}>
              <Image src={ShareIcon} alt="share" />
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
                  <ItemMusic key={key} trackNumber={key} item={item} />
                ))}

              </tbody>
            </table>
          </div>
        </div >
      }
    </>
  )
}