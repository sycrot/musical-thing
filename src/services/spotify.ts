'use client'
import axios from 'axios';
import { login } from './redux/user/slice';

const path = 'https://api.spotify.com/v1';

export async function getUser (dispatch: any) {
  await axios.get(`${path}/me`, {
    headers: {
      'Content-Type' : 'application/json',
      'Authorization' : `Bearer ${window.localStorage.token}`
    }
  }).then(({data}) => {
    dispatch(login(data))
  })
}