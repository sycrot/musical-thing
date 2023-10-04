import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  playlists: null
}

const playlistsSlice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {
    setPlaylists: (state, action) => {
      return { ...state, playlists: action.payload };
    },
  }
})

export const {
  setPlaylists
} = playlistsSlice.actions

export default playlistsSlice.reducer