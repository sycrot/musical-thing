'use client'
import axios from 'axios';
import { login } from './redux/user/slice';

const path = 'https://api.spotify.com/v1';

const headers = {
  'Content-Type' : 'application/json',
  'Authorization' : `Bearer ${window.localStorage.token}`
}

export async function getUser (dispatch: any) {
  await axios.get(`${path}/me`, {
    headers: headers
  }).then(({data}) => {
    dispatch(login(data))
  })
}

export async function getUserPlaylists () {
  let playlists:any = []

  await axios.get(`${path}/me/playlists?limit=50`, {
    headers
  }).then(({data}) => {
    playlists = data.items
  })

  return playlists
}