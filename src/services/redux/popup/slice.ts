import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  popup: {
    text: '',
    show: false
  }
}

const popupSlice = createSlice({
  name: 'popup',
  initialState,
  reducers: {
    ShowPopup: (state, action) => {
      return { ...state, popup: action.payload };
    },
    HidePopup: (state) => {
      return { ...state, popup: {text: '', show: false} }
    }
  }
})

export const {
  ShowPopup,
  HidePopup
} = popupSlice.actions

export default popupSlice.reducer