'use client'
import ArrowIcon from '@/assets/images/icons/arrow-white.svg'
import ArrowIconGray from '@/assets/images/icons/arrow-gray.svg'
import Image from "next/image"
import { useRouter } from 'next/navigation'
import { Tooltip } from '@mui/material'

interface Props {
  gray?: boolean
}

export default function NavigateBackButton(props: Props) {
  const router = useRouter()

  const handleBack = () => {
    router.back()
  }

  return (
    <Tooltip title={`Previous page`} placement="top" arrow>
      <button onClick={handleBack} className='w-17p'>
        {props.gray ?
          <Image src={ArrowIconGray} alt="prev" className='w-full' />
          :
          <Image src={ArrowIcon} alt="prev" className='w-full' />
        }
      </button>
    </Tooltip>
  )
}