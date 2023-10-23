'use client'
import React from "react";
import Image from "next/image";
import XIcon from "@/assets/images/icons/x-notrounded.svg"
import { handleCloseAnimate, handleImage } from "@/utils/main";
import { Modal, Tooltip } from "@mui/material";
import ButtonModal from "../buttonModal";
import { useDispatch, useSelector } from "react-redux";
import * as yup from 'yup'
import { useFormik } from "formik";
import { CreatePlaylist } from "@/services/spotify";
import UploadIcon from '@/assets/images/icons/upload.svg'
import CoverIcon from '@/assets/images/icons/cover.svg'
import { LoadingButton } from "@mui/lab";

const schema = yup.object({
  name: yup.string().required(`This field is required`),
  description: yup.string(),
  public: yup.boolean()
})

interface Props {
  openNewPlaylist: boolean
  setOpenNewPlaylist: (b: boolean) => void
}

export default function AddNewPlaylist(props: Props) {
  const refCard = React.useRef<any>(null)
  const { user } = useSelector((r: any) => r.userReducer)
  const [photo, setPhoto] = React.useState<any>()
  const [photoURL, setPhotoURL] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      public: false
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      setLoading(true)
      const photoSrc = photo ? photo.slice(23) : null
      await CreatePlaylist(user.id, values.name, values.public, values.description, photoSrc).then(res => {
        setLoading(false)
        handleBack()
      })
    }
  })

  const handleBack = () => {
    handleCloseAnimate(refCard, props.openNewPlaylist, props.setOpenNewPlaylist, 'animate-scaleReverse')
  }

  return (
    <Modal open={props.openNewPlaylist} onClose={handleBack} className="flex justify-center items-center">
      <form onSubmit={formik.handleSubmit}>
        <div className="bg-white rounded-xl p-5 w-full max-w-sm text-center animate-scale" ref={refCard}>
          <div className="text-center relative">
            <Tooltip title={`Close`} placement="top" arrow>
              <button onClick={handleBack} className="absolute left-0 top-1">
                <Image src={XIcon} alt="Close" className="mr-1" />
              </button>
            </Tooltip>
            <h3 className="text-24 text-center font-bold">Create new playlist</h3>
          </div>
          <div className="relative flex justify-center mt-4">
            <input type="file" id="photoURL" name="photoURL" accept="image/jpeg" onChange={(e: any) => handleImage(e, setPhoto, setPhotoURL)} className="w-20 h-24 opacity-0 absolute top-0 z-10" />
            <div className="w-20 h-20 overflow-hidden rounded-md bg-gray-10 relative flex justify-center items-center">
              {photoURL.length !== 0 ?
                <Image src={photo} alt="Cover" width={80} height={80} className="object-cover w-full h-full" />
                :
                <Image src={CoverIcon} alt="Cover" width={40} height={40} />
              }

            </div>
            <div className="rounded-full bg-green-50 absolute w-6 h-6 flex justify-center items-center -bottom-3">
              <Image src={UploadIcon} alt="Upload" />
            </div>
          </div>

          <input type="text" placeholder="Playlist name" className="px-4 py-2 outline-none mt-6 bg-gray-10 rounded-full w-full" name="name" value={formik.values.name} onChange={formik.handleChange} />
          <textarea name="description" value={formik.values.description} onChange={formik.handleChange} rows={2} className="w-full px-4 py-2 outline-none mt-3 bg-gray-10 resize-none rounded-md" placeholder="Description"></textarea>
          {/* <div className="flex gap-5 mt-2">
            <div className="flex gap-1">
              <input type="radio" value="true" onChange={formik.handleChange} name="public" />
              <label><p>Public</p></label>
            </div>
            <div className="flex gap-1">
              <input type="radio" value="false" onChange={formik.handleChange} name="public" />
              <label><p>Private</p></label>
            </div>
          </div> */}
          <div className="flex mt-6 gap-3 justify-end">
            <ButtonModal text="Cancel" onClick={handleBack} />
            <ButtonModal text="Create" color={`bg-green-50 text-white ${formik.values.name.length <= 0 && 'pointer-events-none'}`} type="submit" loading={loading} />
          </div>
        </div>
      </form>
    </Modal>
  )
}