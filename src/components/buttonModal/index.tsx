interface Props {
  text: string
  color?: string
  onClick?: (e?: any) => void
}

export default function ButtonModal (props: Props) {
  return (
    <button className={`py-1 px-6 w-full ${props.color ?? 'text-gray-60 bg-white border border-gray-30'} rounded-full hover:brightness-110 w-max`} onClick={props.onClick}>{props.text}</button>
  )
}