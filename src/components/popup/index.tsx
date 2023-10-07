import { HidePopup } from "@/services/redux/popup/slice";
import { Snackbar } from "@mui/material";
import { useDispatch } from "react-redux";

interface Props {
  open: boolean
  text: React.ReactNode
}

export function PopupMessage(props: Props) {
  const dispatch = useDispatch()

  const closePopup = () => {
    dispatch(HidePopup())
  }

  return (
    <Snackbar open={props.open} autoHideDuration={1400} onClose={closePopup} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      <p className="shadow-card-15 bg-green-50 text-16 text-white px-6 py-2 rounded-full">{props.text}</p>
    </Snackbar>
  )
}