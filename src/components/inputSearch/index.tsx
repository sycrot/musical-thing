import React from "react";
import Image from "next/image";
import SearchIcon from '@/assets/images/icons/search.svg'
import XIcon from '@/assets/images/icons/x.svg'

interface Props {
  placeholder?: string
  textSearch: string
  buttonClearSearch: boolean
  setButtonClearSearch: (e: boolean) =>  void
  setLoading: (e: boolean) => void
  setTextSearch: (e: string) => void
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

  return (
    <>
      <Image src={SearchIcon} alt="Search" className="absolute top-7p left-6p" />
      <input type="text" placeholder={props.placeholder} className="text-gray-60 outline-none bg-gray-20 rounded-3xl py-1 px-7 w-full" value={props.textSearch} onChange={handleSearch} />
      {props.buttonClearSearch &&
        <button className="w-5 h-5 absolute top-6p right-6p">
          <Image src={XIcon} alt="Clear" onClick={handleClickButtonClear} />
        </button>
      }
    </>

  )
}