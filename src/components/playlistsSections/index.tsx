import { GetCategoryPlaylists } from "@/services/spotify"
import React from "react"
import PlaylistItem from "../playlistItem"
import Slider from "react-slick"

interface Props {
  title: string
  category: string
}

export function PlaylistsSection(props: Props) {
  const [playlists, setPlaylists] = React.useState<[]>([])

  React.useEffect(() => {
    const handlePlaylists = async () => {
      await GetCategoryPlaylists(props.category, 10).then(data => {
        setPlaylists(data)
      })
    }
    handlePlaylists()
  }, [props.category])

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5
  };

  return (
    <div className="mt-8" id="playlistSection">
      <h2 className="font-bold text-24">{props.title}</h2>
      <Slider {...settings} centerPadding="-20px" >
        {playlists.map((item: any, key) => (
          <PlaylistItem key={item.id} id={item.id} title={item.name} description={item.description} image={item.images[0].url} />
        ))}
      </Slider>
    </div>
  )
}