import { GetCategoryPlaylists } from "@/services/spotify"
import React from "react"
import PlaylistItem from "../playlistItem"
import Slider from "react-slick"
import { Skeleton } from "@mui/material"
import { useSelector } from "react-redux"

interface Props {
  title: string
  category?: string
  items?: any
  loadedItems?: boolean
}

const HandleSkeleton = () => {
  return (
    <div className="mt-8">
      <Skeleton variant="text" width={200} height={36} />
      <div className="flex justify-between mt-4">
        {
          Array(5).fill('skeleton').map((item, index) => (
            <div key={index} className="w-full max-w-190">
              <Skeleton variant="rounded" width={190} height={190} />
              <div className="w-3/4 mt-2">
                <Skeleton variant="text" sx={{ fontSize: '16px' }} />
                <Skeleton variant="text" sx={{ width: '60%', fontSize: '16px' }} />
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export function PlaylistsSection(props: Props) {
  const { user } = useSelector((r: any) => r.userReducer)
  const [playlists, setPlaylists] = React.useState<[]>([])
  const [loading, setLoading] = React.useState(true)

  const handlePlaylists = React.useCallback(async () => {
    if (props.category) {
      if (user) {
        await GetCategoryPlaylists(props.category, 10).then(data => {
          setPlaylists(data)
          setLoading(false)
        })
      }
    }
  }, [props.category, user])

  React.useEffect(() => {
    handlePlaylists()
  }, [handlePlaylists])

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5
  };

  return (
    <div className="mt-8" id="playlistSection">
      {props.loadedItems ?? loading ?
        <HandleSkeleton />
        :
        <>
          <h2 className="font-bold text-24">{props.title}</h2>
          <Slider {...settings} centerPadding="-20px" >
            {props.items ?
              props.items.map((item: any, key: any) => (
                <PlaylistItem key={item.id} id={item.id} title={item.name} description={item?.description} image={item.images[0]?.url} type="album" />
              ))
              :
              playlists.map((item: any, key: any) => (
                <PlaylistItem key={item.id} id={item.id} title={item.name} description={item?.description} image={item.images[0]?.url} type="playlist" />
              ))
            }

          </Slider>
        </>
      }
    </div>
  )
}