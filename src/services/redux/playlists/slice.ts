import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  userPlaylists: [],
  orderLibraryUser: 'recent',
  colorPage: ''
}

const playlistsSlice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {
    setUserPlaylists: (state, action) => {
      return { ...state, userPlaylists: action.payload };
    },
    setOrderLibraryUser: (state, action) => {
      return { ...state, orderLibraryUser: action.payload }
    },
    setColorPage: (state, action) => {
      return { ...state, colorPage: action.payload }
    }
  }
})

export const {
  setUserPlaylists,
  setOrderLibraryUser,
  setColorPage
} = playlistsSlice.actions

export default playlistsSlice.reducer