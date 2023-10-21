'use client'
import { handleCloseAnimate } from "@/utils/main";
import { CircularProgress, Modal } from "@mui/material";
import Image from "next/image";
import XIcon from "@/assets/images/icons/x-notrounded.svg"
import React from "react";
import { InputSearch } from "../inputSearch";
import { AddToPlaylist, CreatePlaylist, GetPlaylistItems, GetUserPlaylists, SearchUserLibrary } from "@/services/spotify";
import { useDispatch, useSelector } from "react-redux";
import SidebarPlaylistItem from "../sidebarPlaylistIem";
import { ShowPopup } from "@/services/redux/popup/slice";

interface Props {
  open: boolean
  setOpen: (open: boolean) => void
  uriMusic: string
  name: string
  idMusic: string
}

export default function ModalAddToPlaylist(props: Props) {
  const [buttonClearSearch, setButtonClearSearch] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [loadingSearch, setLoadingSearch] = React.useState(false)
  const [textSearch, setTextSearch] = React.useState('')
  const { user } = useSelector((r: any) => r.userReducer)
  const { userPlaylists } = useSelector((r: any) => r.playlistsReducer)
  const refCard = React.useRef<any>(null)
  const [playlists, setPlaylists] = React.useState<any>([])
  const dispatch = useDispatch()

  const handlePlaylistsSearch = React.useCallback(() => {
    let list: any = []

    userPlaylists?.map((item: any) => {
      if (item.owner.id === user.id) {
        list.push(item)
      }
    })

    let listResult = list.filter(function (value: any) {
      return value.name.toLowerCase().indexOf(textSearch.toLowerCase()) > -1
    })

    setPlaylists(listResult)
  }, [textSearch, user?.id, userPlaylists])

  const handleInitialPlaylists = React.useCallback(() => {
    let list: any = []

    userPlaylists?.map((item: any) => {
      if (item.owner.id === user.id) {
        list.push(item)
      }
    })

    setPlaylists(list)
  }, [user?.id, userPlaylists])

  React.useEffect(() => {
    const handlePlaylists = () => {
      if (textSearch.length > 0) {
        handlePlaylistsSearch()
      } else {
        handleInitialPlaylists()
      }

    }
    handlePlaylists()
  }, [handleInitialPlaylists, handlePlaylistsSearch, textSearch.length])

  const handleBack = () => {
    setLoading(false)
    handleCloseAnimate(refCard, props.open, props.setOpen, 'animate-scaleReverse')
  }

  const handleClick = async (e: any, playlist_id: string, name: string) => {
    e.preventDefault()
    let idEqual = false
    setLoading(true)

    await GetPlaylistItems(playlist_id).then(async (data: any) => {
      data.map(async (item: any) => {
        if (item.track.id === props.idMusic) {
          idEqual = true
        }
      })

      if (!idEqual) {
        await AddToPlaylist(playlist_id, props.uriMusic, name).then(() => {
          handleBack()
        })
      } else {
        dispatch(ShowPopup({
          text: 'Added to your library',
          show: true
        }))
        handleBack()
      }
    })
  }

  const handleCreatePlaylist = async () => {
    setLoading(true)
    await CreatePlaylist(user.id, props.name, true, '').then(async (data) => {
      await AddToPlaylist(data.id, props.uriMusic, props.name).then(() => {
        handleBack()
      })
    })
  }

  return (
    <Modal open={props.open} onClose={handleBack} className="flex justify-center items-center">
      <div className="bg-white rounded-xl p-5 w-full max-w-sm text-center animate-scale relative" ref={refCard}>
        {loading &&
          <div className="absolute top-0 left-0 bg-black-10 flex justify-center items-center w-full h-full z-20">
            <CircularProgress className="text-orange-50"/>
          </div>
        }
        <div className="text-center relative">
          <button onClick={handleBack} className="absolute left-0 top-1">
            <Image src={XIcon} alt="Close" className="mr-1" />
          </button>
          <h3 className="text-24 text-center font-bold">Add to playlist</h3>
        </div>
        <div className="mt-4 relative">
          <InputSearch
            buttonClearSearch={buttonClearSearch}
            setButtonClearSearch={setButtonClearSearch}
            setLoading={setLoadingSearch}
            setTextSearch={setTextSearch}
            textSearch={textSearch}
            placeholder="Search playlist" />
        </div>
        <button className="mt-4 border-b border-gray-30 pb-2 w-full text-left text-gray-50 hover:text-gray-60" onClick={handleCreatePlaylist}>
          <p className="font-bold">Create playlist</p>
        </button>
        <div className="mt-4 text-left">
          {playlists &&
            <>
              {
                playlists.length <= 0 && textSearch.length > 0 &&
                <p className="pl-1">0 results for <b>"{textSearch}"</b></p>
              }
              {playlists?.map((item: any) => (
                <SidebarPlaylistItem
                  id={item.id}
                  by={item.owner.display_name}
                  image={item.images[0]?.url}
                  title={item.name}
                  key={item.id}
                  onClick={e => handleClick(e, item.id, item.name)} />
              ))}
            </>
          }
        </div>
      </div>
    </Modal>
  )
}