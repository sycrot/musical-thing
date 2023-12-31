/* eslint-disable @next/next/no-img-element */
'use client'
import { GetAlbum, GetPlaylist, checkIfUserFollowed, getRecentlyPlayedTrack, getUserPlaylistLikedMusics, handleFollow, handleUnfollow } from "@/services/spotify"
import Link from "next/link"
import React, { useRef } from "react"
import HeartIcon from '@/assets/images/icons/heart-gray.svg'
import HeartLIcon from '@/assets/images/icons/heart-l-gray.svg'
import PlayIcon from '@/assets/images/icons/play-button.svg'
import PauseIcon from '@/assets/images/icons/pause-button.svg'
import PrevIcon from '@/assets/images/icons/prev-button.svg'
import AleatoryIcon from '@/assets/images/icons/aleatory-icon.svg'
import RepeatIcon from '@/assets/images/icons/repeat.svg'
import AddToPlaylistIcon from '@/assets/images/icons/add-to-playlist.svg'
import SoundIcon from '@/assets/images/icons/sound.svg'
import SoundOffIcon from '@/assets/images/icons/sound-off.svg'
import Image from "next/image"
import { Skeleton, Slider, Tooltip } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import { setAleatory, setCurrentTrack, setPlayMusic, setRepeat, setTrackItem, setTrackNumber, setTracksPlaylist } from "@/services/redux/playlists/slice"
import { LoadingButton } from "@mui/lab"
import ModalAddToPlaylist from "../modalAddToPlaylist"

const HandleSkeleton = () => {
  return (
    <>
      <div className="flex gap-2 items-center w-1/4">
        <Skeleton variant="rounded" width={120} height={120} />
        <div className="w-3/4">
          <Skeleton variant="text" sx={{ fontSize: '16px' }} />
          <Skeleton variant="text" sx={{ width: '60%', fontSize: '16px' }} />
        </div>
      </div>
      <div className="w-1/2 flex flex-col items-center">
        <div className="flex gap-5 items-center">
          <Skeleton variant="circular" width={30} height={30} />
          <Skeleton variant="circular" width={30} height={30} />
          <Skeleton variant="circular" width={50} height={50} />
          <Skeleton variant="circular" width={30} height={30} />
          <Skeleton variant="circular" width={30} height={30} />
        </div>
        <Skeleton variant="rounded" width={480} height={12} className="mt-5" />
      </div>
      <div className="flex w-1/4 gap-2 items-center justify-end">
        <Skeleton variant="circular" width={30} height={30} />
        <Skeleton variant="circular" width={30} height={30} />
        <Skeleton variant="rounded" width={142} height={12} />
      </div>
    </>

  )
}

export default function Player() {
  const { tracksPlaylist, currentTrack, playMusic, trackItem, trackNumber, currentPlaylistId, trackCover, currentPlaylistType, aleatory, repeat } = useSelector((r: any) => r.playlistsReducer)
  const { user } = useSelector((r: any) => r.userReducer)
  const [trackCurrentTime, setTrackCurrentTime] = React.useState(0)
  const [trackPercent, setTrackPercent] = React.useState(0)
  const [trackDuration, setTrackDuration] = React.useState(0)
  const dispatch = useDispatch()
  const [liked, setLiked] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [loadingData, setLoadingData] = React.useState(true)
  const [modalAddToPlaylists, setModalAddToPlaylist] = React.useState(false)
  const [volume, setVolume] = React.useState(100)
  const buttonUnfollowRef = React.useRef<any>(null)

  const handleRecentTrack = React.useCallback(async () => {
    setLoadingData(true)
    if (user) {
      await getRecentlyPlayedTrack().then(data => {
        dispatch(setTrackItem(data.items[0]?.track))
        dispatch(setCurrentTrack(new Audio(data.items[0]?.track.preview_url)))
        setLoadingData(false)
      })
    }
  }, [user])

  const handleCurrentTrackNumber = React.useCallback(() => {
    if (tracksPlaylist) {
      const item = tracksPlaylist[trackNumber]?.track ?? tracksPlaylist[trackNumber]
      const url = tracksPlaylist[trackNumber]?.track?.preview_url ?? tracksPlaylist[trackNumber]?.preview_url
      dispatch(setTrackItem(item))
      currentTrack.load()
      currentTrack.setAttribute('src', url)
      if (playMusic) handlePlay()
    }
  }, [trackNumber, tracksPlaylist])

  const handleCheckFollowedTrack = React.useCallback(async () => {
    if (trackItem?.id) {
      await checkIfUserFollowed('me/tracks/contains', trackItem.id).then(data => setLiked(data))
    }
  }, [trackItem?.id])

  React.useEffect(() => {
    if (tracksPlaylist === null) {
      handleRecentTrack()
    }
    handleCurrentTrackNumber()
    handleCheckFollowedTrack()
  }, [handleRecentTrack, tracksPlaylist, handleCurrentTrackNumber, handleCheckFollowedTrack])

  React.useEffect(() => {
    if (tracksPlaylist && tracksPlaylist.length > 1) {
      if (trackPercent === 100) {
        if (repeat === 'ever') {
          handlePlay()
        }
        if (repeat === 'one') {
          handleRepeatOne()
        }
        if (repeat === 'off') {
          handleNext()
        }
      }
    }
  }, [trackPercent, repeat])

  const handleTimeUpdate = () => {
    const currentPercentage = (currentTrack.currentTime / currentTrack.duration) * 100
    setTrackCurrentTime(currentTrack.currentTime)
    setTrackPercent(currentPercentage)
  }

  currentTrack?.addEventListener('timeupdate', () => {
    handleTimeUpdate()
  })

  currentTrack?.addEventListener('loadedmetadata', () => {
    setTrackDuration(currentTrack?.duration)
  })

  const handlePlay = async () => {
    currentTrack.play()
    dispatch(setPlayMusic(true))
  }

  const handleRepeatOne = () => {
    handlePlay()

    setTimeout(() => {
      dispatch(setRepeat('off'))
    }, 100)
  }

  const handlePause = () => {
    currentTrack.pause()
    dispatch(setPlayMusic(false))
  }

  const handleNext = () => {
    if (trackNumber === tracksPlaylist?.length - 1) {
      dispatch(setTrackNumber(0))
    } else {
      dispatch(setTrackNumber(trackNumber + 1))
    }

    handlePlay()
  }

  const handlePrev = () => {
    if (trackNumber === 0) {
      dispatch(setTrackNumber(tracksPlaylist.length - 1))
    } else {
      dispatch(setTrackNumber(trackNumber - 1))
    }

    handlePlay()
  }

  /* Setup a return data from playlist type */
  const aleatoryData = (data: any) => {
    let trackId = ''

    data.forEach((item: any) => {
      if (currentPlaylistType === 'album') {
        if (item?.id === tracksPlaylist[trackNumber].id) {
          trackId = item.id
        }
      } else {
        if (item.track?.id === tracksPlaylist[trackNumber].track.id) {
          trackId = item.track.id
        }
      }

    })

    dispatch(setTracksPlaylist(data))

    let filterTrack: any = null

    /* Check current track number */
    if (currentPlaylistType === 'album') {
      filterTrack = data.findIndex((el: any) => el.id === trackId)
    } else {
      filterTrack = data.findIndex((el: any) => el.track.id === trackId)
    }

    dispatch(setTrackNumber(filterTrack))
  }

  const handleAleatory = async (e: any) => {
    e.preventDefault()
    if (aleatory) {
      switch (currentPlaylistType) {
        case 'playlist':
          if (currentPlaylistId) {
            await GetPlaylist(currentPlaylistId).then(data => {
              aleatoryData(data.tracks.items)
            })
          }
          break;
        case 'album':
          if (currentPlaylistId) {
            await GetAlbum(currentPlaylistId).then(data => {
              aleatoryData(data.tracks.items)
            })
          }
          break;
        case 'favorites':
          await getUserPlaylistLikedMusics().then(data => {
            aleatoryData(data)
          })
      }
    } else {
      let items: any = [...tracksPlaylist]
      let newItems: any = []
      newItems.push(tracksPlaylist[trackNumber])

      items.sort(() => Math.random() - 0.5).forEach((item: any) => {
        newItems.push(item)
      })

      /* Check tracks equals */
      var tracksAleatory = newItems.filter(function (item: any) {
        return !newItems[JSON.stringify(item)] && (newItems[JSON.stringify(item)] = true)
      })

      dispatch(setTracksPlaylist(tracksAleatory))
      dispatch(setTrackNumber(0))
    }

    dispatch(setAleatory(!aleatory))
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

  const handleRepeat = (e: any) => {
    e.preventDefault()


    switch (repeat) {
      case 'one':
        dispatch(setRepeat('off'))
        break;
      case 'ever':
        dispatch(setRepeat('one'))
        break;
      case 'off':
        dispatch(setRepeat('ever'))
        break;
      default:
        dispatch(setRepeat(''))
    }
  }

  const handleFollowTrack = async () => {
    await handleFollow('me/tracks', trackItem.id, 'songs', setLoading, setLiked, buttonUnfollowRef)
  }

  const handleUnfollowTrack = async () => {
    await handleUnfollow('me/tracks', trackItem.id, 'songs', setLoading, setLiked)
  }

  const handleVolume = (e: any) => {
    if (currentTrack) {
      setVolume(e.target.value)
      currentTrack.volume = e.target.value / 100
    }
  }

  const handleMute = () => {
    if (currentTrack) {
      if (volume === 0) {
        currentTrack.volume = 1
        setVolume(100)
      } else {
        currentTrack.volume = 0
        setVolume(0)
      }
    }
  }

  return (
    <>
      <ModalAddToPlaylist open={modalAddToPlaylists} setOpen={setModalAddToPlaylist} uriMusic={trackItem?.uri} name={trackItem?.name} idMusic={trackItem?.id} />
      <div className="w-full h-full pt-6p">
        <div className="w-full bg-white rounded-tr-xl rounded-tl-xl p-4 h-full flex items-center justify-between">
          {loadingData ?
            <HandleSkeleton /> :
            <>
              <div className="grid grid-cols-player items-center gap-2 w-1/4">
                {trackItem &&
                  <>
                    <div className="rounded-5px overflow-hidden w-120 h-120">
                      <img src={trackItem.album?.images[0]?.url ?? trackCover?.url} alt={trackItem.name} />
                    </div>
                    <div className="overflow-hidden w-full relative">
                      <p className={`
                      text-18 
                      font-bold 
                      block 
                      whitespace-nowrap 
                      absolute top-0 
                      ${trackItem.name.length >= 14 && 'animate-slideText'}`}>
                        {trackItem.name}
                      </p>
                      <div className={`mt-7 flex gap-2 ${trackItem.artists.length >= 2 && 'animate-slideText'}`}>
                        {trackItem.artists?.map((item: any, key: any) => (
                          <Link href={`/artists/${item.id}`} key={key}><p className="text-16 font-normal text-gray-50 truncate hover:underline">{item.name} </p></Link>
                        ))}
                      </div>
                    </div>
                    {loading ?
                      <LoadingButton loading className="w-6 h-6 min-w-0" />
                      :
                      liked ?
                        <Tooltip title="Dislike track" placement="top" arrow>
                          <button className="w-6 h-6" onClick={handleUnfollowTrack}>
                            <Image src={HeartLIcon} alt="Heart" className="w-full h-full" ref={buttonUnfollowRef} />
                          </button>
                        </Tooltip>
                        :
                        <Tooltip title="Like track" placement="top" arrow>
                          <button className="w-6 h-6" onClick={handleFollowTrack}>
                            <Image src={HeartIcon} alt="Heart" className="w-full h-full" />
                          </button>
                        </Tooltip>

                    }
                  </>
                }
              </div>
              <div className="flex flex-col items-center w-1/2">
                <div className="flex gap-5">
                  <Tooltip title={`${aleatory ? 'Disable random' : 'Random mode'}`} placement="top" arrow>
                    <button
                      className={`${!tracksPlaylist || tracksPlaylist.length <= 1 ? 'pointer-events-none opacity-60' : ''} ${aleatory ? 'button-active' : 'grayscale'} hover:brightness-125`}
                      onClick={handleAleatory}>
                      <Image src={AleatoryIcon} alt="Aleatory" />
                    </button>
                  </Tooltip>
                  <Tooltip title={`Previous track`} placement="top" arrow>
                    <button
                      onClick={handlePrev}
                      className={`${!tracksPlaylist || tracksPlaylist.length <= 1 ? 'pointer-events-none opacity-60' : ''} hover:brightness-125`}>
                      <Image src={PrevIcon} alt="prev" />
                    </button>
                  </Tooltip>
                  {playMusic ?
                    <Tooltip title={`Pause`} placement="top" arrow>
                      <button
                        onClick={handlePause}
                        className={`w-13 h-13 justify-center items-center ${!trackItem && 'pointer-events-none'} active:scale-90`}
                        >
                        <Image src={PauseIcon} alt="pause" className="w-full h-full hover:scale-105" />
                      </button>
                    </Tooltip>
                    :
                    <Tooltip title={`Play`} placement="top" arrow>
                      <button
                        onClick={handlePlay}
                        className={`w-13 h-13 justify-center items-center ${!trackItem && 'pointer-events-none'} active:scale-90`}>
                        <Image src={PlayIcon} alt="play" className="w-full h-full hover:scale-105" />
                      </button>
                    </Tooltip>
                  }
                  <Tooltip title={`Next track`} placement="top" arrow>
                    <button
                      className={`rotate-180 ${!tracksPlaylist || tracksPlaylist.length <= 1 ? 'pointer-events-none opacity-60' : ''} hover:brightness-125`}
                      onClick={handleNext}>
                      <Image src={PrevIcon} alt="prev" />
                    </button>
                  </Tooltip>
                  <Tooltip title={`
                    ${repeat === 'ever' ? 'Repeat one' : ''}
                    ${repeat === 'one' ? 'Do not repeat' : ''}
                    ${repeat === 'off' ? 'Repeat' : ''}
                  `} placement="top" arrow>
                    <button className={`
                  ${!tracksPlaylist || tracksPlaylist.length <= 1 ? 'pointer-events-none opacity-60' : ''} 
                    ${repeat === 'ever' && 'button-active'} 
                    ${repeat === 'one' && 'button-repeat-one'}
                    ${repeat === 'off' && 'grayscale'}
                    hover:brightness-125`}
                      onClick={handleRepeat}>
                      <Image src={RepeatIcon} alt="repeat" />
                    </button>
                  </Tooltip>

                </div>
                <div className="flex items-center mt-5 gap-2">
                  <span>{handleDuration(trackCurrentTime * 1000)}</span>
                  <Slider min={0} max={100} aria-label="Small" className="w-430 text-orange-50" value={trackPercent} onChange={handleChangePercentage} />
                  <span>{handleDuration(trackDuration * 1000)}</span>
                </div>
              </div>
              <div className="w-1/4">
                <div className="flex gap-4 justify-end">
                  <Tooltip title="Add to playlist" placement="top" arrow>
                    <button onClick={() => setModalAddToPlaylist(true)} className="hover:brightness-125">
                      <Image src={AddToPlaylistIcon} alt="Add to playlist" />
                    </button>
                  </Tooltip>
                  <Tooltip title={`${volume === 0 ? 'Unmute' : 'Mute'}`} placement="top" arrow>
                    <button onClick={handleMute} className="hover:brightness-125">
                      <Image src={volume === 0 ? SoundOffIcon : SoundIcon} alt="Sound" />
                    </button>
                  </Tooltip>

                  <Slider min={0} max={100} aria-label="Small" className="w-28 text-orange-50" value={volume} onChange={handleVolume} />
                </div>
              </div>
            </>
          }
        </div>
      </div>
    </>
  )
}