'use client'
import ArrowIcon from '@/assets/images/icons/arrow-white.svg'
import Image from "next/image"
import { useRouter } from 'next/navigation'

export default function NavigateBackButton () {
  const router = useRouter()

  const handleBack = () => {
    router.back()
  }

  return (
    <button onClick={handleBack}>
      <Image src={ArrowIcon} alt="prev" />
    </button>
  )
}