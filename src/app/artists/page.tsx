'use client'
import ArtistItem from "@/components/artistItem"
import { GetTopArtists } from "@/services/spotify"
import { Skeleton } from "@mui/material"
import React from "react"
import { useSelector } from "react-redux"

export default function Artists() {
  const { user } = useSelector((r: any) => r.userReducer)
  const [artists, setArtists] = React.useState<[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const handleArtists = async () => {
      if (user) {
        await GetTopArtists().then(data => {
          setArtists(data)
          setLoading(false)
        })
      }
    }
    handleArtists()
  }, [user])

  return (
    <div className="px-5 pt-20 pb-10">
      {loading ?
        <>
          <Skeleton variant="rounded" width={230} height={36} />
          <div className="flex mt-4 flex-wrap">
            {
              Array(30).fill('skeleton').map((item, index) => (
                <div key={index} className="w-40 p-10p flex flex-col items-center justify-center">
                  <Skeleton variant="circular" width={70} height={70} />
                  <Skeleton variant="rounded" width={70} height={16} className="mt-2"/>
                  <Skeleton variant="rounded" width={50} height={14}  className="mt-1"/>
                </div>
              ))
            }
          </div>
        </>
        :
        <>
          <h2 className="text-24 font-bold">Most listened to</h2>
          <div className="flex gap-10 flex-wrap justify-between mt-4">
            {artists &&
              artists.map((item: any, key) => (
                <ArtistItem key={key} name={item.name} type={item.type} image={item.images[0]?.url} id={item.id} />
              ))
            }
          </div>
        </>
      }
    </div>
  )
}