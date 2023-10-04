import { combineReducers } from "redux"
import userReducer from './user/slice'
import playlistsReducer from './playlists/slice'

const rootReducer = combineReducers({ userReducer, playlistsReducer })

export default rootReducer