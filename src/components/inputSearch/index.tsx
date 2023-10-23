import React from "react";
import Image from "next/image";
import SearchIcon from '@/assets/images/icons/search.svg'
import XIcon from '@/assets/images/icons/x.svg'
import { Tooltip } from "@mui/material";

interface Props {
  placeholder?: string
  textSearch: string
  buttonClearSearch: boolean
  setButtonClearSearch: (e: boolean) => void
  setLoading: (e: boolean) => void
  setTextSearch: (e: string) => void
  setKeyCode?: (e: number) => void
  onClick?: (e?: any) => void
}

export function InputSearch(props: Props) {
  const handleSearch = (e: any) => {
    if (e.target.value.length > 0) {
      props.setButtonClearSearch(true)
      props.setLoading(true)
    } else {
      props.setButtonClearSearch(false)
    }
    props.setTextSearch(e.target.value)
  }

  const handleClickButtonClear = () => {
    props.setTextSearch('')
    props.setButtonClearSearch(!props.buttonClearSearch)
  }

  const handleKeyDown = (e: any) => {
    if (props.setKeyCode) props.setKeyCode(e.keyCode)
  }

  return (
    <>
      <button className="absolute top-7p left-6p" onClick={props.onClick}>
        <Image src={SearchIcon} alt="Search" />
      </button>
      <input type="text" placeholder={props.placeholder} className="text-gray-60 outline-none bg-gray-20 rounded-3xl py-1 px-7 w-full" value={props.textSearch} onChange={handleSearch} onKeyDown={handleKeyDown} />
      {props.buttonClearSearch &&
        <Tooltip title={`Clean`} placement="top" arrow>
          <button className="w-5 h-5 absolute top-6p right-6p">
            <Image src={XIcon} alt="Clear" onClick={handleClickButtonClear} />
          </button>
        </Tooltip>
      }
    </>

  )
}