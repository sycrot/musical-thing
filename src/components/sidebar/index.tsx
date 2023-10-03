'use client'
import React from "react";
import Image from "next/image";
import Logo from '@/assets/images/logo-musicalthing.svg'
import HeartIcon from '@/assets/images/icons/heart.svg'
import UserIcon from '@/assets/images/icons/user.svg'
import LibraryIcon from '@/assets/images/icons/library.svg'
import PlusIcon from '@/assets/images/icons/plus.svg'
import SearchIcon from '@/assets/images/icons/search.svg'
import XIcon from '@/assets/images/icons/x.svg'
import DownIcon from '@/assets/images/icons/down.svg'
import Link from "next/link";
import SidebarPlaylistItem from "../sidebarPlaylistIem";
import AddNewPlaylist from "../addNewPlaylist";
import MenuDropdown, { TMenu } from "../menuDropdown";
import { useSelector } from "react-redux";

export default function Sidebar() {
  const [openNewPlaylist, setOpenNewPlaylist] = React.useState(false)
  const [libraryOrder, setLibraryOrder] = React.useState('Recent')
  const { user } = useSelector((r: any) => r.userReducer)

  const menuOrderItems: TMenu[] = [
    {
      name: 'Recent',
      onClick: () => setLibraryOrder('Recent')
    },
    {
      name: 'Alphabetical',
      onClick: () => setLibraryOrder('Alphabetical')
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
              <Image src={imageUser ? imageUser : UserIcon} alt="Avatar" width={100} height={100} className="w-full h-full object-cover"/>
            </Link>
            <button className="">
              <Image src={HeartIcon} alt="Favorites" />
            </button>
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
              <Image src={SearchIcon} alt="Search" className="absolute top-7p left-6p" />
              <input type="text" placeholder="Search your library" className="text-gray-60 outline-none bg-gray-20 rounded-3xl py-1 px-7 w-full" />
              <button className="w-5 h-5 absolute top-6p right-6p">
                <Image src={XIcon} alt="Clear" />
              </button>
            </div>
            <div className="relative flex items-center">
              <MenuDropdown items={menuOrderItems} button={
                <>
                  <p className="text-14">{libraryOrder}</p><Image src={DownIcon} alt="Order" className="ml-1" />
                </>
              } />
            </div>
          </div>
        </div>
        <div className="rounded-b-xl bg-white w-full h-full flex-auto grow overflow-y-scroll pt-4 scroll-">
          <div className="pl-2 grow h-4/5">
            <SidebarPlaylistItem title="Workout musics ✨ Mix Player" image="https://cdn.pixabay.com/photo/2017/06/20/22/14/man-2425121_1280.jpg" by="Discover Bytes" />
          </div>
        </div>
      </div>
    </>

  )
}