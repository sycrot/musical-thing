import { Snackbar } from "@mui/material";

interface Props {
  open: boolean
  setOpen: (e: boolean) => void
  text: React.ReactNode
}

export function PopupMessage(props: Props) {
  return (
    <Snackbar open={props.open} autoHideDuration={1400} onClose={() => props.setOpen(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      <p className="shadow-card-15 bg-green-50 text-16 text-white px-6 py-2 rounded-full">{props.text}</p>
    </Snackbar>
  )
}