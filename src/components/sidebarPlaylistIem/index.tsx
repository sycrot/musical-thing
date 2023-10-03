'use client'
import Image from "next/image"
import MenuIcon from '@/assets/images/icons/menu-points.svg'
import React from "react"
import MenuDropdown, { TMenu } from "../menuDropdown"
import ShareIcon from '@/assets/images/icons/share.svg'

interface Props {
  image: string
  title: string
  by: string
}

export default function SidebarPlaylistItem(props: Props) {
  const [buttonHover, setButtonHover] = React.useState(false)

  const menuItems: TMenu[] = [
    {
      name: 'Remove from your library',
      onClick: () => console.log('click')
    },
    {
      name: 'Share (Copy Link)',
      onClick: () => console.log('click'),
      icon: ShareIcon
    }
  ]

  const handleMouseOut = () => {
    setButtonHover(false)
  }

  return (
    <div className="p-1 flex items-center pr-10 cursor-pointer hover:bg-green-10 rounded-md relative" onMouseOver={() => setButtonHover(true)} onMouseOut={handleMouseOut}>
      <div className="rounded-md overflow-hidden w-14 h-14 block bg-gray-50">
        <Image src={props.image} alt="" width={100} height={100} className="w-full h-full object-cover" />
      </div>
      <div className="ml-2 truncate">
        <p className="font-medium text-18 truncate">{props.title}</p>
        <p className="text-gray-50 text-16 truncate">{props.by}</p>
      </div>
      
      {buttonHover &&
        <>
          <MenuDropdown items={menuItems} buttonStyle="absolute right-1 rounded-50p p-1 hover:bg-green-20" menuItemsStyle="mt-10l" button={
            <>
              <Image src={MenuIcon} alt="Menu" />
            </>
          } />
        </>

      }

    </div>
  )
}