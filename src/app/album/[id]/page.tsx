/* eslint-disable @next/next/no-img-element */
'use client'
import React from "react"
import NavigateBackButton from "@/components/navigateBackButton"
import { useParams, usePathname } from "next/navigation"
import { GetAlbum, checkIfUserFollowed, handleFollow, handlePlayItem, handleUnfollow } from "@/services/spotify"
import Image from "next/image"
import ButtonPlayIcon from '@/assets/images/icons/play-button.svg'
import HeartIcon from '@/assets/images/icons/heart-l-white.svg'
import HeartLIcon from '@/assets/images/icons/heart.svg'
import ShareIcon from '@/assets/images/icons/share-white.svg'
import ItemMusic from "@/components/musicItem"
import { handleAnimationButtonLike, handleCopyShare } from "@/utils/main"
import { LoadingButton } from "@mui/lab"
import { Skeleton } from '@mui/material'
import Link from "next/link"
import { useSelector } from "react-redux"

const HandleSkeletonAlbum = () => {
  return (
    <>
      <div className="px-5 pt-20 pb-10">
        <div className="mt-16">
          <div className="flex items-center gap-2">
            <div className="">
              <Skeleton variant="rounded" width={220} height={60} />
              <Skeleton variant="rounded" width={470} height={24} className="mt-6"/>
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
  const [album, setAlbum] = React.useState<any>(undefined)
  const [tracks, setTracks] = React.useState<[]>([])
  const [followed, setFollowed] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const buttonUnfollow = React.useRef<any>(null)

  const handleTracks = React.useCallback(async () => {
    if (user) {
      await GetAlbum(id as string).then(data => {
        setAlbum(data)
        setTracks(data.tracks.items)
      })
    }
  }, [id, user])

  const handleFollowedAlbum = React.useCallback(async () => {
    await checkIfUserFollowed('me/albums/contains', id as string).then(data => setFollowed(data))
  }, [id])

  React.useEffect(() => {
    handleTracks()
    handleFollowedAlbum()
  }, [handleFollowedAlbum, handleTracks])

  const handleFollowAlbum = async () => {
    await handleFollow('me/albums', id as string, 'albums', setLoading, setFollowed).then(() => {
      setTimeout(() => {
        handleAnimationButtonLike(buttonUnfollow)
      }, 100)
    })
  }

  const handleUnfollowAlbum = async () => {
    await handleUnfollow('me/albums', id as string, 'albums', setLoading, setFollowed)
  }

  const handleClickPlay = async (e: any) => {
    e.preventDefault()

    await handlePlayItem(id as string, 'album')
  }

  return (
    <>
      {album ?
        <>
          <div className="px-5 pt-20 pb-10" style={{
            backgroundImage: `url(${album.images[0]?.url})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundColor: 'rgba(0,0,0,.4)'
          }}>
            <div className="w-full">
              <NavigateBackButton />
            </div>
            <div className="flex w-full mt-5 gap-5">
              <div className="text-white flex flex-col justify-center truncate">
                <h1 className="font-bold text-40 text-shadow-sm shadow-gray-60">{album.name}</h1>
                <p className="truncate text-shadow-sm shadow-gray-60">{album.description}</p>
                <p className="text-14 mt-6 text-shadow-sm shadow-gray-60">Made by {album.artists.map((item: any, key: any) => (
                  <Link key={key} href={`/artists/${item.id}`} className="hover:underline"><b>{item.name}{album.artists.length > 1 && ' '}</b></Link>
                ))} • {album.total_tracks} Songs</p>
              </div>
            </div>
            <div className="flex gap-5 mt-7 items-center">
              <button onClick={handleClickPlay}>
                <Image src={ButtonPlayIcon} alt="play" />
              </button>
              {loading ?
                <LoadingButton loading className="w-9 h-9 min-w-0" />
                :
                followed ?
                  <button onClick={handleUnfollowAlbum} className="w-9 h-9">
                    <Image src={HeartLIcon} alt="heart" className="w-full h-full" ref={buttonUnfollow}/>
                  </button>
                  :
                  <button onClick={handleFollowAlbum} className="w-9 h-9">
                    <Image src={HeartIcon} alt="heart" className="w-full h-full drop-shadow-icon" />
                  </button>
              }


              <button onClick={() => handleCopyShare(window.location.href)}>
                <Image src={ShareIcon} alt="share" className="drop-shadow-icon" />
              </button>
            </div>
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
                {tracks.map((item: any, key) => (
                  <ItemMusic key={key} trackNumber={key+1} id={item.id} name={item.name} uri={item.uri} image={album.images[0]?.url} artists={item.artists} album={album} duration_ms={item.duration_ms} idPlaylist={id as string} typePlaylist="album" trackUri={item.uri}/>
                ))}

              </tbody>
            </table>
          </div>
        </>
        :
        <HandleSkeletonAlbum />

      }
    </>
  )
}