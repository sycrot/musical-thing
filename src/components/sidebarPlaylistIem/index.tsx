/* eslint-disable @next/next/no-img-element */
'use client'
import Image from "next/image"
import MenuIcon from '@/assets/images/icons/menu-points.svg'
import React from "react"
import MenuDropdown, { TMenu } from "../menuDropdown"
import ShareIcon from '@/assets/images/icons/share.svg'
import AttetionIcon from '@/assets/images/icons/attention.svg'
import { DeleteUserPlaylist } from "@/services/spotify"
import { Modal } from "@mui/material"
import { handleCloseAnimate, handleCopyShare } from "@/utils/main"
import ButtonModal from "../buttonModal"
import Link from "next/link";
import { useDispatch } from "react-redux"
import { ShowPopup } from "@/services/redux/popup/slice"
import { useRouter } from "next/navigation"

interface Props {
  id: string
  image: string
  title: string
  by: string
  onClick?: (e?: any) => void
  actions?: boolean
}

export default function SidebarPlaylistItem(props: Props) {
  const [buttonHover, setButtonHover] = React.useState(false)
  const [modalRemove, setModalRemove] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const router = useRouter()
  const refCard = React.useRef<any>(null)

  const removePlaylist = async (e: any) => {
    e.preventDefault()
    await DeleteUserPlaylist(props.id, setLoading, setModalRemove).then(() => {
      router.push('/')
    })
  }

  const menuItems: TMenu[] = [
    {
      name: 'Remove from your library',
      onClick: () => setModalRemove(true)
    },
    {
      name: 'Share (Copy Link)',
      onClick: () => handleCopyShare(`${window.location.origin}/playlist/${props.id}`),
      icon: ShareIcon
    }
  ]

  const handleMouseOut = () => {
    setButtonHover(false)
  }

  const handleBack = (e: any) => {
    e.preventDefault()
    handleCloseAnimate(refCard, modalRemove, setModalRemove, 'animate-scaleReverse')
    setLoading(false)
    handleMouseOut()
  }

  return (
    <Link href={`/playlist/${props.id}`} className="p-1 grid grid-cols-playlist gap-2 w-full items-center pr-10 cursor-pointer hover:bg-green-10 rounded-md relative" onMouseOver={() => setButtonHover(true)} onMouseOut={handleMouseOut} onClick={props.onClick}>
      <div className="rounded-md overflow-hidden w-14 h-14">
        <img src={props.image} alt="" width={100} height={100} className="w-full h-full object-cover" />
      </div>
      <div className="truncate col-start-2">
        <p className="font-medium text-18 truncate">{props.title}</p>
        <p className="text-gray-50 text-16 truncate">{props.by}</p>
      </div>

      {props.actions &&
        buttonHover &&
        <>
          <MenuDropdown items={menuItems} buttonStyle="absolute right-1 rounded-50p p-1 hover:bg-green-20" menuItemsStyle="mt-10l -right-8" button={
            <>
              <Image src={MenuIcon} alt="Menu" />
            </>
          } />
        </>
      }

      <Modal open={modalRemove} onClose={handleBack} className="flex justify-center items-center">
        <div className="bg-white rounded-xl p-5 w-full max-w-lg animate-scale" ref={refCard}>
          <p className="text-16">Remove <b>{props.title}</b> from your library?</p>
          <div className="flex items-center gap-2 mt-4">
            <Image src={AttetionIcon} alt="Attetion" />
            <p className="text-14 text-genre-red">Attention: This action will remove the playlist from your Spotify library</p>
          </div>
          <div className="flex justify-end gap-3 mt-12">
            <ButtonModal text="Cancel" onClick={handleBack} />
            <ButtonModal text="Remove" onClick={removePlaylist} color="bg-orange-50 text-white" loading={loading}/>
          </div>
        </div>
      </Modal>
    </Link>
  )
}