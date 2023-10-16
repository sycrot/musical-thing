import { ShowPopup } from "@/services/redux/popup/slice"
import store from "@/services/redux/store"

export function handleCloseAnimate(refBody: any, openClose: boolean, setOpenClose: (b: boolean) => void, animate: string) {
  refBody.current.classList.add(animate)

  setTimeout(() => {
    setOpenClose(!openClose)
  }, 0.1 * 1000)
}

export function handleImage(e: any, setPhotoURL: (value: string) => void, setPhoto: (photo: any) => void) {
  let r = new FileReader()

  r.onload = () => {
    setPhotoURL(r.result as string)
  }
  r.readAsDataURL(e.target?.files[0])

  setPhoto(e)
}

export function handleCopyShare(text: string) {
  store.dispatch(ShowPopup({
    text: 'Link copied to clipboard',
    show: true
  }))

  navigator.clipboard.writeText(text)
}
