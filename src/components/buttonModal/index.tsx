import { LoadingButton } from "@mui/lab"

interface Props {
  text: string
  color?: string
  onClick?: (e?: any) => void
  type?: "button" | "submit" | "reset" | undefined
  loading?: boolean
}

export default function ButtonModal(props: Props) {
  return (
    <>
      {props.loading &&
          <LoadingButton loading className={`py-1 px-6 w-full ${props.color ?? 'text-gray-60 bg-white border border-gray-30'} rounded-full hover:brightness-110 w-max`}>
          </LoadingButton>
      }
      <button className={`py-1 px-6 w-full ${props.color ?? 'text-gray-60 bg-white border border-gray-30'} rounded-full hover:brightness-110 w-max ${props.loading && 'hidden'}`} onClick={props.onClick} type={props.type ?? 'button'}>{props.text}</button>
    </>

  )
}