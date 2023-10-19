'use client'
import ArtistItem from "@/components/artistItem"
import MusicItemRelative from "@/components/musicItemRelative"
import NavigateBackButton from "@/components/navigateBackButton"
import PlaylistItem from "@/components/playlistItem"
import { handleSearch } from "@/services/spotify"
import { Skeleton } from "@mui/material"
import { useParams } from "next/navigation"
import React from "react"
import { useSelector } from "react-redux"

const buttonItems = [
  'All',
  'Musics',
  'Playlists',
  'Artists',
  'Albums'
]

const HandleSkeleton = () => {
  return (
    <div className="mt-6">
      <Skeleton variant="rounded" width={170} height={30} />
      <div className="flex mt-3 flex-wrap justify-between">
        {
          Array(4).fill('skeleton').map((item, index) => (
            <div className="flex gap-1 items-center w-1/2 mt-2" key={index}>
              <Skeleton variant="rounded" width={44} height={44} />
              <div className="">
                <Skeleton variant="rounded" width={150} height={16} />
                <Skeleton variant="rounded" width={100} height={16} className="mt-1" />
              </div>
            </div>
          ))
        }
      </div>
      <Skeleton variant="rounded" width={170} height={30} className="mt-6" />
      <div className="flex mt-3 gap-1 flex-wrap justify-between">
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
      <Skeleton variant="rounded" width={170} height={30} className="mt-6" />
      <div className="flex mt-3 gap-1 flex-wrap justify-between">
        {
          Array(5).fill('skeleton').map((item, index) => (
            <div key={index} className="w-40 p-10p flex flex-col items-center justify-center">
              <Skeleton variant="circular" width={70} height={70} />
              <Skeleton variant="rounded" width={70} height={16} className="mt-2" />
              <Skeleton variant="rounded" width={50} height={14} className="mt-1" />
            </div>
          ))
        }
      </div>

    </div>
  )
}

export default function SearchPage() {
  const { user } = useSelector((r: any) => r.userReducer)
  const [tag, setTag] = React.useState('All')
  const [albums, setAlbums] = React.useState<any>([])
  const [artists, setArtists] = React.useState<any>([])
  const [playlists, setPlaylists] = React.useState<any>([])
  const [tracks, setTracks] = React.useState<any>([])
  const [loading, setLoading] = React.useState(true)
  const { text } = useParams()

  React.useEffect(() => {
    const handleItems = async () => {
      if (user) {
        await handleSearch(text as string).then(data => {
          setAlbums(data.albums.items)
          setArtists(data.artists.items)
          setPlaylists(data.playlists.items)
          setTracks(data.tracks.items)
          setLoading(false)
        })
      }
    }
    handleItems()
  }, [text])

  return (
    <div className="px-5 pt-20 pb-10">
      <div className="w-full flex gap-2">
        <NavigateBackButton gray />
        {buttonItems.map((item, key) => (
          <button key={key} className={`${tag === item ? 'text-white bg-gray-60 pointer-events-none' : 'text-gray-50 bg-gray-10 hover:bg-gray-20'} text-16 py-1 px-3 rounded-full`} onClick={() => setTag(item)}>{item}</button>
        ))}
      </div>
      {loading ?
        <HandleSkeleton />
        :
        <>
          {tag === 'All' &&
            <>
              <div className="mt-6">
                <h2 className="font-bold text-24">Musics</h2>
                <div className="flex flex-wrap mt-3 items-center">
                  {tracks.slice(0, 4).map((item: any, key: any) => (
                    <MusicItemRelative
                      key={key}
                      id={item.id}
                      name={item.name}
                      uri={item.uri}
                      image={item.album.images[0]?.url}
                      trackNumber={item.track_number}
                      artists={item.artists}
                      album={item.album}
                      duration_ms={item.duration_ms}
                      className="w-1/2" />
                  ))}
                </div>
              </div>
              <div className="mt-6">
                <h2 className="font-bold text-24">Playlists</h2>
                <div className="flex mt-3 justify-between">
                  {playlists.slice(0, 5).map((item: any, key: any) => (
                    <PlaylistItem
                      key={key}
                      id={item.id}
                      title={item.name}
                      description={item.description}
                      image={item.images[0]?.url}
                      type={item.type} />
                  ))}
                </div>
              </div>
              <div className="mt-6">
                <h2 className="font-bold text-24">Artists</h2>
                <div className="flex mt-3 justify-between">
                  {artists.slice(0, 6).map((item: any, key: any) => (
                    <ArtistItem key={key} id={item.id} image={item.images[0]?.url} name={item.name} type={item.type} />
                  ))}
                </div>
              </div>
              <div className="mt-6">
                <h2 className="font-bold text-24">Albums</h2>
                <div className="flex mt-3 justify-between">
                  {albums.slice(0, 5).map((item: any, key: any) => (
                    <PlaylistItem key={key} id={item.id} title={item.name} description={''} image={item.images[0]?.url} type={item.type} />
                  ))}
                </div>
              </div>
            </>
          }
          {tag === 'Musics' &&
            <div className="mt-6">
              <h2 className="font-bold text-24">Musics</h2>
              <div className="flex flex-wrap mt-3 items-center">
                {tracks.map((item: any, key: any) => (
                  <MusicItemRelative
                    key={key}
                    id={item.id}
                    name={item.name}
                    uri={item.uri}
                    image={item.album.images[0]?.url}
                    trackNumber={item.track_number}
                    artists={item.artists}
                    album={item.album}
                    duration_ms={item.duration_ms}
                    className="w-full" />
                ))}
              </div>
            </div>
          }
          {tag === 'Playlists' &&
            <div className="mt-6">
              <h2 className="font-bold text-24">Playlists</h2>
              <div className="flex mt-3 gap-2 justify-between flex-wrap">
                {playlists.map((item: any, key: any) => (
                  <PlaylistItem
                    key={key}
                    id={item.id}
                    title={item.name}
                    description={item.description}
                    image={item.images[0]?.url}
                    type={item.type} />
                ))}
              </div>
            </div>
          }
          {tag === 'Artists' &&
            <div className="mt-6">
              <h2 className="font-bold text-24">Artists</h2>
              <div className="flex mt-3 gap-2 justify-between flex-wrap">
                {artists.map((item: any, key: any) => (
                  <ArtistItem key={key} id={item.id} image={item.images[0]?.url} name={item.name} type={item.type} />
                ))}
              </div>
            </div>
          }
          {tag === 'Albums' &&
            <div className="mt-6">
              <h2 className="font-bold text-24">Albums</h2>
              <div className="flex mt-3 gap-2 justify-between flex-wrap">
                {albums.map((item: any, key: any) => (
                  <PlaylistItem key={key} id={item.id} title={item.name} description={''} image={item.images[0]?.url} type={item.type} />
                ))}
              </div>
            </div>
          }
        </>
      }
    </div>
  )
}