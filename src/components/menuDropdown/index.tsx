'use client'
import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu"
import Image from "next/image"
import React from "react"

export type TMenu = {
  name: string,
  onClick: () => void,
  icon?: string
}

interface Props {
  items: Array<TMenu>
  button: React.ReactNode
  buttonStyle?: string
  menuItemsStyle?: string
}

export default function MenuDropdown(props: Props) {
  return (
    <Menu menuButton={<MenuButton className={`flex items-center ${props.buttonStyle ? props.buttonStyle : 'ml-3 mr-3'}`} onClick={e => e.preventDefault()}>{props.button}</MenuButton>}>
      <div className={`absolute p-1 bg-white shadow-card-15 rounded-4px z-10 w-max ${props.menuItemsStyle}`}>
        {props.items.map((item, key) => (
          <MenuItem key={key}>
            <button className="flex justify-between items-center w-full p-2 py-1 hover:bg-gray-10 hover:font-medium rounded-4px cursor-pointer" onClick={e => {
              e.preventDefault()
              item.onClick()
            }}>
              <p className="text-14 text-start mr-4">{item.name}</p>
              {item.icon !== undefined && <Image src={item.icon} alt="Icon" />}
            </button>
          </MenuItem>
        ))}
      </div>

    </Menu>
  )
}