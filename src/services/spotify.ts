'use client'
import axios from 'axios';
import { login } from './redux/user/slice';
import { setPlaylists } from './redux/playlists/slice';

const path = 'https://api.spotify.com/v1';

const headers = {
  'Content-Type' : 'application/json',
  'Authorization' : `Bearer ${typeof window !== "undefined" ? window?.localStorage.token : ''}`
}

export async function getUser (dispatch: any) {
  if (window.localStorage.token) {
    await axios.get(`${path}/me`, {
      headers
    }).then(({data}) => {
      dispatch(login(data))
    }).catch(err => {
      handleErrors(err)
    })
  }
  
}

export async function getUserPlaylists (dispatch?: any) {
  let playlists:any = []

  if (window.localStorage.token) {
    await axios.get(`${path}/me/playlists?limit=50`, {
      headers
    }).then(({data}) => {
      dispatch(setPlaylists(data.items))
      playlists = data.items
    }).catch(err => {
      handleErrors(err)
    })
  }

  return playlists
}

export async function getUserPlaylistLikedMusics () {
  let playlists:any = []

  if (window.localStorage.token) {
    await axios.get(`${path}/me/tracks?limit=50`, {
      headers
    }).then(({data}) => {
      playlists = data.items
    }).catch(err => {
      handleErrors(err)
    })
  }
  

  return playlists
}

export async function deleteUserPlaylist (id: string, dispatch: any) {
  if (window.localStorage.token) {
    await axios.delete(`${path}/playlists/${id}/followers`, {
      headers
    }).then(async () => {
      await getUserPlaylists(dispatch)
    }).catch(err => {
      handleErrors(err)
    })
  }
}

export const searchUserLibrary = async (text: string, playlists: any,dispatch: any) => {
  let list:any = playlists

  let listResult = list.filter(function(value: any) {
      return value.name.toLowerCase().indexOf(text.toLowerCase()) > -1
  })

  dispatch(setPlaylists(listResult))
}

const handleErrors = (err: any) => {
  if (err.response.data.error.message === 'Invalid access token') {
    location.reload()
  }

  if (err.response.data.error.message === 'The access token expired') {
    window.localStorage.removeItem('token')
    location.reload()
  }

  console.log(err)
}