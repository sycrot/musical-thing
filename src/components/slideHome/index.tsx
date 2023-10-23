import React, { useRef } from "react";
import Slider from 'react-slick'
import { CheckIfUserFollowPlaylist, DeleteUserPlaylist, FollowPlaylist, GetFeaturedPlaylists, handlePlayItem } from "@/services/spotify";
import Image from "next/image";
import IconHeartL from '@/assets/images/icons/heart-l.svg'
import IconHeart from '@/assets/images/icons/heart.svg'
import ButtonModal from "../buttonModal";
import { LoadingButton } from "@mui/lab";
import { Skeleton, Tooltip } from '@mui/material'
import { useSelector } from "react-redux";
import Link from "next/link";

interface FPProps {
  id: string
}

const HandleSkeleton = () => {
  return (
    <div className="w-full flex justify-center items-center">
      <Skeleton variant="rounded" width={100} height={200} />
      <Skeleton variant="rounded" width={825} height={260} />
      <Skeleton variant="rounded" width={100} height={200} />
    </div>
  )
}

function FollowedPlaylist(props: FPProps) {
  const [followed, setFollowed] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const buttonRef = React.useRef<any>(null)

  const handleFollowedPlaylist = React.useCallback(async () => {
    await CheckIfUserFollowPlaylist(props.id).then(data => setFollowed(data))
  }, [props.id])


  React.useEffect(() => {
    handleFollowedPlaylist()
  }, [handleFollowedPlaylist])

  const handleFollowPlaylist = async (id: string) => {
    await FollowPlaylist(id, setLoading, setFollowed, buttonRef)
  }

  const handleUnfollowPlaylist = async (id: string) => {
    await DeleteUserPlaylist(id, setLoading, setFollowed)
  }

  return (
    <>
      {loading ?
        <LoadingButton loading className="w-9 h-9 min-w-0" />
        :
        followed ?
          <Tooltip title="Unfollow playlist" placement="top" arrow>
            <button className="w-9 h-9" onClick={() => handleUnfollowPlaylist(props.id)}>
              <Image src={IconHeart} alt="Like" className={`w-full h-full`} ref={buttonRef} />
            </button>
          </Tooltip>
          :
          <Tooltip title="Follow playlist" placement="top" arrow>
            <button className="w-9 h-9" onClick={() => handleFollowPlaylist(props.id)}><Image src={IconHeartL} alt="Like" className="w-full h-full" /></button>
          </Tooltip>
      }
    </>
  )
}

export default function SlideHome() {
  const { user } = useSelector((r: any) => r.userReducer)
  const [playlists, setPlaylists] = React.useState<[]>([])
  const [loading, setLoading] = React.useState(true)

  const handleClickPlay = async (e: any, id: string) => {
    e.preventDefault()

    await handlePlayItem('playlist', id as string)
  }

  const handleSlideItems = React.useCallback(async () => {
    if (user) {
      await GetFeaturedPlaylists().then(data => {
        setPlaylists(data)
        setLoading(false)
      })
    }
  }, [user])

  React.useEffect(() => {
    handleSlideItems()
  }, [handleSlideItems])

  return (
    <div id="slideHome">
      {loading ?
        <HandleSkeleton />
        :
        <Slider
          className="center"
          centerMode={true}
          infinite={true}
          centerPadding="-48px"
          slidesToShow={3}
          speed={500}
        >
          {playlists &&
            playlists.map((item: any, key: any) => (
              <div key={key}>
                <div className="bg-white w-full rounded-xl overflow-hidden grid grid-cols-playlistSlide gap-5 items-center" key={key}>
                  <div className="w-full h-60 flex-shrink-0">
                    <Image src={item.images[0].url} alt="Cover" width={240} height={240} className="w-full h-full" />
                  </div>
                  <div className="content pr-6">
                    <Link href={`/playlist/${item.id}`} className="hover:underline">
                      <h1 className="font-bold text-36">{item.name}</h1>
                      <p className="text-16">{item.description}</p>
                    </Link>
                    <div className="flex mt-6 gap-4">
                      <ButtonModal text="Play" color="bg-orange-50 text-white font-bold" type="button" onClick={e => handleClickPlay(e, item.id)} />
                      <FollowedPlaylist id={item.id} />
                    </div>
                  </div>
                </div>
              </div>
            ))
          }
        </Slider>
      }

    </div>

  )
}