'use client'
import { HidePopup } from "@/services/redux/popup/slice";
import { Snackbar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

export function PopupMessage() {
  const { popup } = useSelector((r: any) => r.popupReducer)
  const dispatch = useDispatch()

  const closePopup = () => {
    dispatch(HidePopup())
  }

  return (
    <Snackbar open={popup.show} autoHideDuration={1400} onClose={closePopup} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      <p className="shadow-card-15 bg-green-50 text-16 text-white px-6 py-2 rounded-full">{popup.text}</p>
    </Snackbar>
  )
}