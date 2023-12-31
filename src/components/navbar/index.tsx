'use client'
import React from "react";
import Link from "next/link";
import { InputSearch } from "../inputSearch";
import { usePathname, useRouter,  } from "next/navigation";

interface NIProps {
  text: string
  href: string
}

function NavItem(props: NIProps) {
  const currentRouter = usePathname()
  const routerWhite = ['genres/', 'playlist', 'artists/', 'album/', 'liked-tracks']

  const router = routerWhite.find(value => currentRouter.includes(value))

  return (
    <Link href={props.href} className={`${
      props.href === currentRouter ? 
      'text-orange-50 font-bold' : 
      router ? 'text-white text-shadow-sm shadow-gray-60' : 'text-gray-50 hover:text-gray-60'} 
      hover:font-bold`}>{props.text}</Link>
  )
}

export default function Navbar() {
  const [buttonClearSearch, setButtonClearSearch] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [textSearch, setTextSearch] = React.useState('')
  const [keyCode, setKeyCode] = React.useState(0)
  const router = useRouter()

  React.useEffect(() => {
    const handleSearchPage = () => {
      if (keyCode === 13) {
        if (textSearch.length > 0) {
          router.push(`/search/${textSearch}`)
        } else {
          router.push('/')
        }
      }
    }
    handleSearchPage()
  }, [keyCode, textSearch])

  const handleClickSearch = () => {
    if (textSearch.length > 0) {
      router.push(`/search/${textSearch}`)
    } else {
      router.push('/')
    }
  }
  
  return (
    <div className="absolute top-7 px-5 w-full">
      <div className="flex items-center justify-between w-full gap-4">
        <div className="flex gap-5">
          <NavItem text="Home" href="/" />
          <NavItem text="Genres" href="/genres" />
          <NavItem text="Artists" href="/artists" />
        </div>
        <div className="w-full max-w-xs relative">
          <InputSearch buttonClearSearch={buttonClearSearch} setButtonClearSearch={setButtonClearSearch} setLoading={setLoading} setTextSearch={setTextSearch} textSearch={textSearch} placeholder="What do you want to hear?" setKeyCode={setKeyCode} onClick={handleClickSearch}/>
        </div>
      </div>

    </div>
  )
}