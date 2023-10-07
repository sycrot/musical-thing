import { combineReducers } from "redux"
import userReducer from './user/slice'
import playlistsReducer from './playlists/slice'
import popupReducer from './popup/slice'

const rootReducer = combineReducers({ userReducer, playlistsReducer, popupReducer })

export default rootReducer