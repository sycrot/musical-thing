/* eslint-disable @next/next/no-img-element */
'use client'
import React from "react"
import NavigateBackButton from "@/components/navigateBackButton"
import { getUserPlaylistLikedMusics, handlePlayItem } from "@/services/spotify"
import Image from "next/image"
import ButtonPlayIcon from '@/assets/images/icons/play-button.svg'
import LikedTracksCover from '@/assets/images/liked-tracks-cover.jpg'
import ItemMusic from "@/components/musicItem"
import { Skeleton } from '@mui/material'
import { useSelector } from "react-redux"

const HandleSkeletonAlbum = () => {
  return (
    <>
      <div className="px-5 pt-20 pb-10">
        <div className="mt-16">
          <div className="flex items-center gap-2">
            <div className="">
              <Skeleton variant="rounded" width={220} height={60} />
              <Skeleton variant="rounded" width={470} height={24} className="mt-6" />
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
  const { user } = useSelector((r: any) => r.userReducer)
  const [tracks, setTracks] = React.useState<any>(undefined)

  const handleTracks = React.useCallback(async () => {
    if (user) {
      await getUserPlaylistLikedMusics().then(data => {
        setTracks(data)
      })
    }
  }, [user])


  React.useEffect(() => {
    handleTracks()
  })

  const handleClickPlay = async (e: any) => {
    e.preventDefault()

    await handlePlayItem('favorites')
  }

  return (
    <>
      {tracks ?
        <>
          <div className="px-5 pt-20 pb-10" style={{
            background: `linear-gradient(#EB6440 0%, transparent 500px)`
          }}>
            <div className="w-full">
              <NavigateBackButton />
            </div>
            <div className="grid grid-cols-playlistPage w-full mt-5 gap-5">
              <div className="w-170 h-170 overflow-hidden rounded-5px">
                <Image src={LikedTracksCover} alt="Liked musics" />
              </div>
              <div className="text-white flex flex-col justify-center truncate">
                <h1 className="font-bold text-40 text-shadow-sm shadow-gray-60">Liked tracks</h1>
                <p className="truncate text-shadow-sm shadow-gray-60">Liked tracks, created for you</p>
                <p className="text-14 mt-6 text-shadow-sm shadow-gray-60">Made by <b>Spotify</b> • {tracks.length} Songs</p>
              </div>
            </div>
            <div className="flex gap-5 mt-7 items-center">
              <button onClick={handleClickPlay}>
                <Image src={ButtonPlayIcon} alt="play" />
              </button>
            </div>
            <div className="px-5 mt-4">
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
                  {tracks.map((item: any, key: any) => (
                    <ItemMusic key={item.track.id} trackNumber={key + 1} id={item.track.id} name={item.track.name} uri={item.track.uri} image={item.track.album.images[0]?.url} artists={item.track.artists} album={item.track.album} duration_ms={item.track.duration_ms} typePlaylist="favorites" trackUri={item.track.uri} />
                  ))}

                </tbody>
              </table>
            </div>
          </div>
        </>
        :
        <HandleSkeletonAlbum />

      }
    </>
  )
}