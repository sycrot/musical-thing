import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  userPlaylists: [],
  orderLibraryUser: 'recent',
  colorPage: '',
  tracks: null,
  trackItem: null,
  currentTrack: null,
  playMusic: false,
  trackNumber: 0
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
    },
    setTracks: (state, action) => {
      return { ...state, tracks: action.payload }
    },
    setCurrentTrack: (state, action) => {
      return { ...state, currentTrack: action.payload }
    },
    setPlayMusic: (state, action) => {
      return { ...state, playMusic: action.payload }
    },
    setTrackItem: (state, action) => {
      return { ...state, trackItem: action.payload }
    },
    setTrackNumber: (state, action) => {
      return { ...state, trackNumber: action.payload }
    },
  }
})

export const {
  setUserPlaylists,
  setOrderLibraryUser,
  setColorPage,
  setTracks,
  setCurrentTrack,
  setPlayMusic,
  setTrackItem,
  setTrackNumber
} = playlistsSlice.actions

export default playlistsSlice.reducer