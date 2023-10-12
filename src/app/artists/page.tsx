'use client'
import ArtistItem from "@/components/artistItem"
import { GetTopArtists } from "@/services/spotify"
import React from "react"

export default function Artists() {
  const [artists, setArtists] = React.useState<[]>([])

  React.useEffect(() => {
    const handleArtists = async () => {
      await GetTopArtists().then(data => {
        setArtists(data)
      })
    }
    handleArtists()
  }, [])

  return (
    <div className="px-5 pt-20 pb-10">
      <h2 className="text-24 font-bold">Most listened to</h2>
      <div className="flex gap-10 flex-wrap justify-between mt-4">
        {artists &&
          artists.map((item: any, key) => (
            <ArtistItem key={key} name={item.name} type={item.type} image={item.images[0]?.url} id={item.id}/>
          ))
        }
      </div>
    </div>
  )
}