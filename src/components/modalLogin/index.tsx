'use client'
import { GetUser } from "@/services/spotify"
import { Modal } from "@mui/material"
import React from "react"
import { useSelector } from "react-redux"
import LogoMusicalThing from '@/assets/images/logo-musicalthing.svg'
import LogoSpotify from '@/assets/images/spotify.svg'
import IconPlus from '@/assets/images/icons/plus.svg'
import Image from "next/image"
import Link from "next/link"

let scopes = [
  'streaming',
  'playlist-read-private',
  'playlist-read-collaborative',
  'playlist-modify-private',
  'playlist-modify-public',
  'user-follow-modify',
  'user-follow-read',
  'user-top-read',
  'user-library-modify',
  'user-library-read',
  'user-read-email',
  'user-read-private',
  'ugc-image-upload',
  'user-read-recently-played',
  'user-read-playback-state',
].join(' ');

let scopes_encoded = scopes.replace(' ', '%20');

export default function ModalLogin() {
  const [modalLogin, setModalLogin] = React.useState(false)
  const CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
  const REDIRECT_URI = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI
  const refCard = React.useRef<any>(null)
  const [token, setToken] = React.useState("");

  React.useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (hash && hash) {
      token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token"))?.split("=")[1] as string;
      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }

    setToken(token || '')
  }, [])

  React.useEffect(() => {
    const handleUser = async () => {
      await GetUser()
    }
    handleUser()
  }, [token])

  React.useEffect(() => {
    if (token.length <= 0) {
      setModalLogin(true)
    } else {
      setModalLogin(false)
    }
  }, [token])
  
  return (
    <Modal open={modalLogin} className="flex justify-center items-center">
      <div className="bg-white rounded-xl p-5 w-full max-w-lg text-center animate-scale" ref={refCard}>
        <div className="flex w-full justify-center items-center gap-4">
          <Image src={LogoMusicalThing} alt="Logo Musical Thing" width={102} height={99} />
          <Image src={IconPlus} alt="Plus" />
          <Image src={LogoSpotify} alt="Logo Spotify" width={80} height={80} />
        </div>
        <div className="w-full mt-10">
          <p className="text-16 text-gray-50">Use Spotify to access and enjoy the Musical Thing</p>
          <span className="text-14 mt-4 block text-gray-50"><b>Warning:</b> Spotify requires users to authenticate with a valid Spotify Premium subscription.</span>
        </div>
        <Link
          href={`https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token&show_dialog=true&scope=${scopes_encoded}`}
          className="px-12 py-4 bg-orange-50 rounded-full text-white font-bold block w-max ml-auto mr-auto mt-10 hover:brightness-110 transition ease-in-out delay-50">Login With Spotify</Link>
      </div>
    </Modal>
  )
}