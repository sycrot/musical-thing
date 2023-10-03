'use client'
import React from "react";
import Image from "next/image";
import XIcon from "@/assets/images/icons/x-notrounded.svg"
import { handleCloseAnimate } from "@/utils/main";
import { Modal } from "@mui/material";

interface Props {
  openNewPlaylist: boolean
  setOpenNewPlaylist: (b: boolean) => void
}

export default function AddNewPlaylist(props: Props) {
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
        <input type="text" placeholder="Playlist name" className="px-4 py-2 outline-none mt-3 bg-gray-10 rounded-full w-full" />
        <div className="flex mt-6 gap-3 justify-center">
          <button className="py-1 px-2 w-full max-w-94 text-gray-60 bg-white border border-gray-30 rounded-full hover:brightness-110 transition ease-in-out delay-150">Cancel</button>
          <button className="py-1 px-2 w-full max-w-94 text-white bg-green-50 rounded-full hover:brightness-110 transition ease-in-out delay-50">Create</button>
        </div>
      </div>
    </Modal>
  )
}