'use client'
import React from "react";
import Image from "next/image";
import XIcon from "@/assets/images/icons/x-notrounded.svg"
import { handleCloseAnimate } from "@/utils/main";
import { Modal } from "@mui/material";
import ButtonModal from "../buttonModal";

interface Props {
  openNewPlaylist: boolean
  setOpenNewPlaylist: (b: boolean) => void
}

export default function AddNewPlaylist(props: Props) {
  const [text, setText] = React.useState('')
  const refCard = React.useRef<any>(null)

  const handleBack = () => {
    handleCloseAnimate(refCard, props.openNewPlaylist, props.setOpenNewPlaylist, 'animate-scaleReverse')
  }

  return (
    <Modal open={props.openNewPlaylist} onClose={handleBack} className="flex justify-center items-center">
      <div className="bg-white rounded-xl p-5 w-full max-w-sm text-center animate-scale" ref={refCard}>
        <div className="text-center relative">
          <button onClick={handleBack} className="absolute left-0 top-1">
            <Image src={XIcon} alt="Close" className="mr-1" />
          </button>
          <h3 className="text-24 text-center font-bold">Create new playlist</h3>
        </div>
        <input type="text" placeholder="Playlist name" className="px-4 py-2 outline-none mt-3 bg-gray-10 rounded-full w-full" value={text} onChange={e => setText(e.target.value)}/>
        <div className="flex mt-6 gap-3 justify-center">
          <ButtonModal text="Cancel" onClick={handleBack}/>
          <ButtonModal text="Create" color={`bg-green-50 text-white ${text.length <= 0 && 'pointer-events-none'}`}/>
        </div>
      </div>
    </Modal>
  )
}