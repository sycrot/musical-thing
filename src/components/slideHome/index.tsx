import React from "react";
import Slider from 'react-slick'
import { CheckIfUserFollowPlaylist, DeleteUserPlaylist, FollowPlaylist, GetFeaturedPlaylists } from "@/services/spotify";
import Image from "next/image";
import IconHeartL from '@/assets/images/icons/heart-l.svg'
import IconHeart from '@/assets/images/icons/heart.svg'

import ButtonModal from "../buttonModal";
import { LoadingButton } from "@mui/lab";

interface FPProps {
  id: string
}

function FollowedPlaylist(props: FPProps) {
  const [followed, setFollowed] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    const handleFollowedPlaylist = async () => {
      await CheckIfUserFollowPlaylist(props.id).then(data => setFollowed(data))
    }
    handleFollowedPlaylist()
  }, [props.id])

  const handleFollowPlaylist = async (id: string) => {
    await FollowPlaylist(id, setLoading, setFollowed)
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
          <button className="w-9 h-9" onClick={() => handleUnfollowPlaylist(props.id)}><Image src={IconHeart} alt="Like" className="w-full h-full" /></button>
          :
          <button className="w-9 h-9" onClick={() => handleFollowPlaylist(props.id)}><Image src={IconHeartL} alt="Like" className="w-full h-full" /></button>
      }
    </>
  )
}

export default function SlideHome() {
  const [playlists, setPlaylists] = React.useState<[]>([])

  const handleSlideItems = React.useCallback(async () => {
    await GetFeaturedPlaylists().then(data => {
      setPlaylists(data)
    })
  }, [])

  React.useEffect(() => {
    handleSlideItems()
  }, [handleSlideItems])

  return (
    <div id="slideHome">
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
              <div className="bg-white w-full rounded-xl overflow-hidden flex gap-5 items-center" key={key}>
                <div className="w-60 h-60 flex-shrink-0">
                  <Image src={item.images[0].url} alt="Cover" width={240} height={240} className="w-full h-full" />
                </div>
                <div className="content pr-6">
                  <h1 className="font-bold text-36">{item.name}</h1>
                  <p className="text-16">{item.description}</p>
                  <div className="flex mt-6 gap-4">
                    <ButtonModal text="Play" color="bg-orange-50 text-white font-bold" type="button" />
                    <FollowedPlaylist id={item.id} />
                  </div>
                </div>
              </div>
            </div>
          ))
        }
      </Slider>
    </div>

  )
}