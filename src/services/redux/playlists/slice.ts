import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  userPlaylists: [],
  orderLibraryUser: 'recent',
  colorPage: '',
  tracksPlaylist: null,
  trackItem: null,
  currentTrack: null,
  playMusic: false,
  trackNumber: 0,
  currentPlaylistId: null,
  trackCover: null
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
    setTracksPlaylist: (state, action) => {
      return { ...state, tracksPlaylist: action.payload }
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
    setCurrentPlaylistId: (state, action) => {
      return { ...state, currentPlaylistId: action.payload }
    },
    setTrackCover: (state, action) => {
      return { ...state, trackCover: action.payload }
    },
  }
})

export const {
  setUserPlaylists,
  setOrderLibraryUser,
  setColorPage,
  setTracksPlaylist,
  setCurrentTrack,
  setPlayMusic,
  setTrackItem,
  setTrackNumber,
  setCurrentPlaylistId,
  setTrackCover
} = playlistsSlice.actions

export default playlistsSlice.reducer