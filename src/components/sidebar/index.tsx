/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
'use client'
import React from "react";
import Image from "next/image";
import Logo from '@/assets/images/logo-musicalthing.svg'
import HeartIcon from '@/assets/images/icons/heart.svg'
import UserIcon from '@/assets/images/icons/user.svg'
import LibraryIcon from '@/assets/images/icons/library.svg'
import PlusIcon from '@/assets/images/icons/plus.svg'
import DownIcon from '@/assets/images/icons/down.svg'
import Link from "next/link";
import SidebarPlaylistItem from "../sidebarPlaylistIem";
import AddNewPlaylist from "../addNewPlaylist";
import MenuDropdown, { TMenu } from "../menuDropdown";
import CoverPlaylist from '@/assets/images/icons/playlist-cover.png'
import { useSelector } from "react-redux";
import { Skeleton } from "@mui/material";
import { GetUserPlaylists, SearchUserLibrary, handleOrderLibrary } from "@/services/spotify";
import { InputSearch } from "../inputSearch";

export default function Sidebar() {
  const [openNewPlaylist, setOpenNewPlaylist] = React.useState(false)
  const [buttonClearSearch, setButtonClearSearch] = React.useState(false)
  const [loading, setLoading] = React.useState(true)
  const [textSearch, setTextSearch] = React.useState('')
  const { user } = useSelector((r: any) => r.userReducer)
  const { userPlaylists, orderLibraryUser } = useSelector((r: any) => r.playlistsReducer)

  const getPlaylists = React.useCallback(async () => {
    if (user) {
      await GetUserPlaylists().then(() => {
        setLoading(false)
      })
    }
  }, [user])

  const handlePlaylistsSearch = React.useCallback(async () => {
    await SearchUserLibrary(textSearch).then(data => {
      setLoading(false)
    })
  }, [textSearch])
  
  React.useEffect(() => {
    const handlePlaylists = () => {
      if (textSearch.length > 0) {
        handlePlaylistsSearch()
      } else {
        getPlaylists()
      }
    }
    handlePlaylists()
  }, [textSearch, getPlaylists, handlePlaylistsSearch])

  const handleOrder = async (order: string) => {
    setLoading(true)
    setTextSearch('')
    await handleOrderLibrary(order).then(() => {
      setLoading(false)
    })
  }

  const menuOrderItems: TMenu[] = [
    {
      name: 'Recent',
      onClick: () => handleOrder('recent')
    },
    {
      name: 'Alphabetical',
      onClick: () => handleOrder('alphabetical')
    }
  ]

  const imageUser = user?.images[0].url

  return (
    <>
      {openNewPlaylist &&
        <AddNewPlaylist openNewPlaylist setOpenNewPlaylist={setOpenNewPlaylist} />
      }
      <div className="w-full h-full flex flex-col">
        <div className="rounded-xl bg-white px-3 py-6 w-full flex flex-col justify-center items-center">
          <Image src={Logo} alt="Musical Thing Logo" />
          <div className="flex justify-between items-center w-full mt-5">
            <Link className="rounded-50p overflow-hidden w-13 h-13 bg-gray-20 flex justify-center items-center" href="">
              <img src={imageUser ? imageUser : UserIcon} alt="Avatar" width={100} height={100} className="w-full h-full object-cover" />
            </Link>
            <Link href={'/liked-tracks'}>
              <Image src={HeartIcon} alt="Favorites" />
            </Link>
          </div>
        </div>
        <div className="rounded-t-xl bg-white pt-6 w-full mt-2">
          <div className="px-3 flex justify-between items-center">
            <div className="flex items-center">
              <Image src={LibraryIcon} alt="Icon library" />
              <p className="text-16 ml-1 text-green-50 font-bold">Your Library</p>
            </div>
            <button className="w-5 h-5" onClick={() => setOpenNewPlaylist(!openNewPlaylist)}>
              <Image src={PlusIcon} alt="Add to your library" />
            </button>
          </div>
          <div className="px-3 mt-6 flex justify-between">
            <div className="relative w-full">
              <InputSearch buttonClearSearch={buttonClearSearch} setButtonClearSearch={setButtonClearSearch} setLoading={setLoading} setTextSearch={setTextSearch} textSearch={textSearch} placeholder="Search your library"/>
            </div>
            <div className="relative flex items-center">
              <MenuDropdown items={menuOrderItems} button={
                <>
                  <p className="text-14">{orderLibraryUser.charAt(0).toUpperCase() + orderLibraryUser.slice(1)}</p><Image src={DownIcon} alt="Order" className="ml-1" />
                </>
              } />
            </div>
          </div>
        </div>
        <div className="rounded-b-xl bg-white w-full h-full flex-auto grow overflow-y-scroll pt-4">
          <div className="pl-2 grow h-4/5">
            {loading ?
              Array(4).fill('skeleton').map((item, index) => (
                <div key={index} className="flex w-full gap-2 items-center mt-2">
                  <Skeleton variant="rounded" sx={{ width: '62px' }} height={64} />
                  <div className="w-3/4">
                    <Skeleton variant="text" sx={{ fontSize: '16px' }} />
                    <Skeleton variant="text" sx={{ width: '60%', fontSize: '16px' }} />
                  </div>
                </div>
              ))
              :
              userPlaylists &&
              <>
                {userPlaylists.length <= 0 && textSearch.length > 0 &&
                  <p className="pl-1">0 results for <b>"{textSearch}"</b></p>
                }
                {userPlaylists.map((item: any, key: any) => (
                  <SidebarPlaylistItem id={item.id} key={key} title={item.name} image={item.images[0]?.url ? item.images[0].url : CoverPlaylist.src} by={item.owner.display_name} actions />
                ))}
              </>

            }

          </div>
        </div>
      </div>
    </>

  )
}