import React from "react";
import Slider from 'react-slick'
import { GetFeaturedPlaylists } from "@/services/spotify";
import Image from "next/image";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ButtonModal from "../buttonModal";

export default function SlideHome() {
  const [playlists, setPlaylists] = React.useState<[]>([])

  React.useEffect(() => {
    const handleSlideItems = async () => {
      await GetFeaturedPlaylists().then((data: any) => {
        console.log(data)
        setPlaylists(data)
      })
    }
    handleSlideItems()
  }, [])

  return (
    <>
      <Slider
        className="center"
        centerMode={true}
        infinite={true}
        centerPadding="-48px"
        slidesToShow={3}
        speed={500}
      >
        {playlists &&
          playlists.map((item: any, key) => (
            <div key={key}>
              <div className="bg-white w-full rounded-xl overflow-hidden flex gap-5 items-center" key={key}>
                <div className="w-60 h-60">
                  <Image src={item.images[0].url} alt="Cover" width={240} height={240} className="w-full h-full" />
                </div>
                <div className="content pr-6">
                  <h1 className="font-bold text-36">{item.name}</h1>
                  <p className="text-16">{item.description}</p>
                  <div className="flex mt-6">
                    <ButtonModal text="Play" color="bg-orange-50 text-white font-bold" type="button" />
                  </div>
                </div>
              </div>
            </div>
          ))
        }
      </Slider>
    </>

  )
}