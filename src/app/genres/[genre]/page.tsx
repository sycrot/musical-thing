'use client'
import React from "react"
import { useSelector } from "react-redux"
import { useParams } from "next/navigation"
import { GetCategoryPlaylists, GetSingleCategory } from "@/services/spotify"
import PlaylistItem from "@/components/playlistItem"
import NavigateBackButton from "@/components/navigateBackButton"

export default function Genre() {
  const router = useParams()
  const { colorPage } = useSelector((r: any) => r.playlistsReducer)
  const [playlists, setPlaylists] = React.useState<[]>([])
  const [pageTitle, setPageTitle] = React.useState('')

  const handlePlaylist = React.useCallback(async () => {
    await GetCategoryPlaylists(router.genre as string, 50).then(data => {
      let list:any = []

      data.map((item:any) => {
        if (item !== null) {
          list.push(item)
        }
      })

      setPlaylists(list)
    })
  }, [router.genre])

  const handleTitle = React.useCallback(async () => {
    await GetSingleCategory(router.genre as string).then(data => {
      setPageTitle(data.name)
    })
  }, [router.genre])

  React.useEffect(() => {
    handlePlaylist()
    handleTitle()
  }, [handlePlaylist, handleTitle])

  return (
    <div className={`px-5 pt-20 pb-10`} style={{ background: `linear-gradient(${colorPage.length > 0 ? colorPage : '#000000'} 0%, transparent 500px)` }}>
      <div className="flex items-center gap-2">
        <NavigateBackButton />
        <h1 className="font-bold text-white text-32">{pageTitle}</h1>
      </div>
      <div className="mt-10 flex gap-4 flex-wrap">
        {playlists &&
          playlists.map((item: any, key) => (
            <PlaylistItem key={key} id={item?.id} title={item?.name} description={item?.description} image={item?.images[0].url} type="playlist"/>
          ))
        }
      </div>
    </div>
  )
}