/* eslint-disable @next/next/no-img-element */
'use client'
import { getRecentlyPlayedTrack } from "@/services/spotify"
import Link from "next/link"
import React from "react"
import HeartIcon from '@/assets/images/icons/heart-gray.svg'
import PlayIcon from '@/assets/images/icons/play-button.svg'
import PauseIcon from '@/assets/images/icons/pause-button.svg'
import PrevIcon from '@/assets/images/icons/prev-button.svg'
import AleatoryIcon from '@/assets/images/icons/aleatory-icon.svg'
import RepeatIcon from '@/assets/images/icons/repeat.svg'
import Image from "next/image"
import { Slider } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import { setCurrentTrack, setPlayMusic, setTrackItem, setTrackNumber, setTracks } from "@/services/redux/playlists/slice"

export default function Player() {
  const { tracks, currentTrack, playMusic, trackItem, trackNumber } = useSelector((r: any) => r.playlistsReducer)
  const [trackCurrentTime, setTrackCurrentTime] = React.useState(0)
  const [trackPercent, setTrackPercent] = React.useState(0)
  const dispatch = useDispatch()

  const handleRecentTrack = React.useCallback(async () => {
    await getRecentlyPlayedTrack().then(data => {
      dispatch(setTrackItem(data.items[0]?.track))
      dispatch(setCurrentTrack(new Audio(data.items[0]?.track.preview_url)))
    })
  }, [])

  const handleCurrentTrackNumber = React.useCallback(() => {
    if (tracks) {
      dispatch(setTrackItem(tracks[trackNumber]?.track))
      currentTrack.load()
      currentTrack.setAttribute('src', tracks[trackNumber]?.track.preview_url)
      if (playMusic) handlePlay()
    }
  }, [trackNumber])

  React.useEffect(() => {
    if (tracks === null) {
      handleRecentTrack()
    }
    handleCurrentTrackNumber()
  }, [handleRecentTrack, tracks, handleCurrentTrackNumber])

  React.useEffect(() => {
    if (tracks && tracks.length > 0) {
      if (trackPercent === 100) {
        handleNext()
      }
    }
  }, [trackPercent])

  const handleTimeUpdate = () => {
    const currentPercentage = (currentTrack.currentTime / currentTrack.duration) * 100
    setTrackCurrentTime(currentTrack.currentTime)
    setTrackPercent(currentPercentage)
  }

  currentTrack?.addEventListener('timeupdate', () => {
    handleTimeUpdate()
  })

  const handlePlay = async () => {
    currentTrack.play()
    dispatch(setPlayMusic(true))
  }

  const handlePause = () => {
    currentTrack.pause()
    dispatch(setPlayMusic(false))
  }

  const handleNext = () => {
    if (trackNumber === tracks.length) {
      dispatch(setTrackNumber(0))
    } else {
      dispatch(setTrackNumber(trackNumber + 1))
    }

    handlePlay()
  }

  const handlePrev = () => {
    if (trackNumber === 0) {
      dispatch(setTrackNumber(tracks.length - 1))
    } else {
      dispatch(setTrackNumber(trackNumber - 1))
    }

    handlePlay()
  }

  const handleAleatory = (e: any) => {
    e.preventDefault()
    let items: any = [...tracks]
    let newItems: any = []
    newItems.push(tracks[0])

    items.sort(() => Math.random() - 0.5).forEach((item: any) => {
      newItems.push(item)
    })

    var tracksAleatory = newItems.filter(function (item: any) {
      return !newItems[JSON.stringify(item)] && (newItems[JSON.stringify(item)] = true)
    })

    dispatch(setTracks(tracksAleatory))
  }


  const handleDuration = (duration: number) => {
    const date = new Date(duration)
    const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
    const seconds = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()

    return `${minutes}:${seconds}`
  }

  const handleChangePercentage = (e: any) => {
    const currentPercent = e.target.value

    currentTrack.currentTime = currentTrack.duration / 100 * currentPercent

    setTrackPercent(currentPercent)
  }

  return (
    <div className="w-full h-full pt-6p">
      <div className="w-full bg-white rounded-tr-xl rounded-tl-xl p-4 h-full flex items-center justify-between">
        {trackItem &&
          <div className="flex items-center gap-2 w-1/4">
            <div className="rounded-5px overflow-hidden w-120 h-120">
              <img src={trackItem.album?.images[0]?.url} alt={trackItem.name} />
            </div>
            <div className="truncate">
              <p className="text-18 font-bold truncate">{trackItem.name}</p>
              {trackItem.artists?.map((item: any, key: any) => (
                <Link href={`/artists/${item.id}`} key={key}><p className="text-16 font-normal text-gray-50 truncate hover:underline">{item.name} </p></Link>
              ))}
            </div>
            <button className="ml-3"><Image src={HeartIcon} alt="Like" /></button>
          </div>
        }
        <div className="flex flex-col items-center w-1/2">
          <div className="flex gap-5">
            <button className={`${tracks === null && 'pointer-events-none opacity-60'}`} onClick={handleAleatory}><Image src={AleatoryIcon} alt="Aleatory" /></button>
            <button onClick={handlePrev} className={`${tracks === null && 'pointer-events-none opacity-60'}`}><Image src={PrevIcon} alt="prev" /></button>
            {playMusic ?
              <button onClick={handlePause} className="w-13 h-13"><Image src={PauseIcon} alt="pause" className="w-full h-full" /></button>
              :
              <button onClick={handlePlay} className="w-13 h-13"><Image src={PlayIcon} alt="play" className="w-full h-full" /></button>
            }

            <button className={`rotate-180 ${tracks === null && 'pointer-events-none opacity-60'}`} onClick={handleNext}><Image src={PrevIcon} alt="prev" /></button>
            <button className={`${tracks === null && 'pointer-events-none opacity-60'}`}><Image src={RepeatIcon} alt="repeat" /></button>
          </div>
          <div className="flex items-center mt-5 gap-2">
            <span>{handleDuration(trackCurrentTime * 1000)}</span>
            <Slider min={0} max={100} aria-label="Small" className="w-430 text-orange-50" value={trackPercent} onChange={handleChangePercentage} />
            <span>{handleDuration(trackItem?.duration_ms)}</span>
          </div>
        </div>
        <div className="w-1/4">

        </div>
      </div>
    </div>
  )
}