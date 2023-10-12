'use client'
import React from "react"
import { useParams, usePathname } from "next/navigation"
import NavigateBackButton from "@/components/navigateBackButton"
import { CheckIfUserFollowedArtist, FollowArtist, GetArtist, GetArtistAlbums, GetArtistRelatedArtists, GetArtistTopTracks, UnfollowArtist } from "@/services/spotify"
import Image from "next/image"
import { LoadingButton } from "@mui/lab"
import ButtonPlayIcon from '@/assets/images/icons/play-button.svg'
import HeartIcon from '@/assets/images/icons/heart-l-white.svg'
import HeartLIcon from '@/assets/images/icons/heart.svg'
import ShareIcon from '@/assets/images/icons/share-white.svg'
import { handleCopyShare } from "@/utils/main"
import ItemMusic from "@/components/musicItem"
import { PlaylistsSection } from "@/components/playlistsSections"
import Slider from "react-slick"
import ArtistItem from "@/components/artistItem"

export default function ArtistPage() {
  const [artist, setArtist] = React.useState<any>(undefined)
  const [topTracks, setTopTracks] = React.useState<[]>([])
  const [albums, setAlbums] = React.useState<[]>([])
  const [relatedArtists, setRelatedArtists] = React.useState<[]>([])
  const [loading, setLoading] = React.useState(false)
  const [followed, setFollowed] = React.useState(false)
  const [slice, setSlice] = React.useState(5)
  const { id } = useParams()
  const routerPathname = usePathname()

  const handleArtist = React.useCallback(async () => {
    await GetArtist(id as string).then(data => {
      setArtist(data)
    })
  }, [id])

  const handleFollowed = React.useCallback(async () => {
    await CheckIfUserFollowedArtist(id as string, 'artist').then(data => {
      setFollowed(data)
    })
  }, [id])

  const handleTopTracks = React.useCallback(async () => {
    await GetArtistTopTracks(id as string).then(data => {
      setTopTracks(data)
    })
  }, [id])

  const handleAlbums = React.useCallback(async () => {
    await GetArtistAlbums(id as string).then(data => {
      setAlbums(data)
    })
  }, [id])

  const handleRelatedArtists = React.useCallback(async () => {
    await GetArtistRelatedArtists(id as string).then(data => {
      setRelatedArtists(data)
    })
  }, [id])

  React.useEffect(() => {
    handleArtist()
    handleFollowed()
    handleTopTracks()
    handleAlbums()
    handleRelatedArtists()
  }, [handleAlbums, handleArtist, handleFollowed, handleRelatedArtists, handleTopTracks])

  const handleFollowPlaylist = async () => {
    await FollowArtist(id as string, 'artist', setLoading, setFollowed)
  }

  const handleUnfollowPlaylist = async () => {
    await UnfollowArtist(id as string, 'artist', setLoading, setFollowed)
  }

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5
  };
  return (
    <>
      {artist &&
        <>
          <div className="px-5 pt-20 pb-10"
            style={{
              backgroundImage: `url(${artist.images[0].url})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundColor: 'rgba(0,0,0,.4)'
            }}>
            <div className="w-full">
              <NavigateBackButton />
            </div>
            <div className="mt-16">
              <h1 className="text-40 text-white font-bold text-shadow-sm shadow-gray-60">{artist.name}</h1>
              <div className="flex gap-5 mt-7 items-center">
                <button>
                  <Image src={ButtonPlayIcon} alt="play" />
                </button>
                {loading ?
                  <LoadingButton loading className="w-9 h-9 min-w-0" />
                  :
                  followed ?
                    <button onClick={handleUnfollowPlaylist} className="w-9 h-9 drop-shadow-md">
                      <Image src={HeartLIcon} alt="heart" className="w-full h-full drop-shadow-icon" />
                    </button>
                    :
                    <button onClick={handleFollowPlaylist} className="w-9 h-9">
                      <Image src={HeartIcon} alt="heart" className="w-full h-full drop-shadow-icon" />
                    </button>
                }


                <button onClick={() => handleCopyShare(routerPathname)}>
                  <Image src={ShareIcon} alt="share" className="drop-shadow-icon"/>
                </button>
              </div>
            </div>
          </div>
          <div className="px-5 mt-4">
            <h3 className="font-bold text-24">Top 10</h3>
            <table className="text-left border-separate border-spacing-0 w-full mt-3" id="tableTopTracks">
              <thead>
                <tr>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {topTracks.slice(0, slice).map((item: any, index) => (
                  <ItemMusic key={index} trackNumber={index + 1} id={item.id} name={item.name} uri={item.uri} image={item.album.images[0]?.url} artists={item.artists} album={item.album} duration_ms={item.duration_ms} />
                ))}
              </tbody>
            </table>
            <div className="mt-6">
              {slice <= 5 ?
                <a onClick={() => setSlice(10)} className="font-medium text-gray-50 hover:text-decoration-line cursor-pointer" href="#tableTopTracks"><p >Show more</p></a>
                :
                <a onClick={() => setSlice(5)} className="font-medium text-gray-50 hover:text-decoration-line cursor-pointer"><p >Show less</p></a>
              }
            </div>
            <div className="mt-4">
              <PlaylistsSection title="Discography" items={albums} />
            </div>
            <div className="mt-6" id="playlistSection">
              <h3 className="font-bold text-24">Related Artists</h3>
              <Slider {...settings} centerPadding="-20px" >
                {relatedArtists.map((item: any, key) => (
                  <ArtistItem key={key} id={item.id} image={item.images[0]?.url} name={item.name} type={item.type} />
                ))}
              </Slider>
            </div>
          </div>
        </>
      }

    </>
  )
}