'use client'
import { getUser } from "@/services/spotify"
import React from "react"
import { useDispatch } from "react-redux"

export default function Home() {
  const CLIENT_ID = process.env.NEXT_SPOTIFY_CLIENT_ID
  const REDIRECT_URI = process.env.NEXT_SPOTIFY_REDIRECT_URI
  const dispatch = useDispatch()

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
      if (token !== '') {
        await getUser(dispatch)
      }
    }
    handleUser()
  }, [token])

  return (
    <main>
      <a href={`https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token`}>
        Login to Spotify
      </a>


    </main>
  )
}
