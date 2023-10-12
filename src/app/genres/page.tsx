'use client'
import { setColorPage } from "@/services/redux/playlists/slice"
import { GetCategories } from "@/services/spotify"
import Link from "next/link"
import React from "react"
import { useDispatch } from "react-redux"


const colors = [
  '#932626',
  '#710084',
  '#111673',
  '#9B0079',
  '#C55301',
  '#059595',
]

export default function Genres() {
  const [genres, setGenres] = React.useState<[]>([])
  const dispatch = useDispatch()

  React.useEffect(() => {
    const handleGenres = async () => {
      await GetCategories().then(data => {
        setGenres(data)
      })
    }
    handleGenres()
  }, [])

  const handleColor = () => {
    let list: any = [...colors]

    for (let i = 0; i <= 7; i++) {
      colors.forEach(item => {
        list.push(item)
      })
    }

    return list
  }

  handleColor()

  return (
    <div className="px-5 pt-20 pb-10 flex gap-3 flex-wrap justify-between">
      {genres.map((item: any, index) => (
        <Link href={`/genres/${item.id}`} key={item.id} className={`p-4 w-full max-w-190 h-190 flex justify-center items-center rounded-md hover:brightness-110`} onClick={() => dispatch(setColorPage(handleColor()[index]))} style={{ background: handleColor()[index]}}>
          <h2 className="text-26 text-white font-bold text-center">{item.name}</h2>
        </Link>
      ))}
    </div>
  )
}