import { PlaylistsSection } from "@/components/playlistsSections"
import SlideHome from "@/components/slideHome"
import React from "react"

export default function HomePage() {
  return (
  <div className="">
    <SlideHome />
    <PlaylistsSection title="For training" category="workout"/>
    <PlaylistsSection title="At dinner time" category="dinner"/>
  </div>
  )
}