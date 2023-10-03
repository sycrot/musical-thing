export function handleCloseAnimate (refBody: any, openClose: boolean,setOpenClose: (b: boolean) =>  void, animate: string) {
  refBody.current.classList.add(animate)

  setTimeout(() => {
    setOpenClose(!openClose)
  }, 0.1 * 1000)
}