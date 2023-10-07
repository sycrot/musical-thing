import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  userPlaylists: [],
  orderLibraryUser: 'recent'
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
    }
  }
})

export const {
  setUserPlaylists,
  setOrderLibraryUser
} = playlistsSlice.actions

export default playlistsSlice.reducer