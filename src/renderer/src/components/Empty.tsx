import { FC } from 'react'
import empty from '../assets/icons/empty.svg'

type EmptyProps = {
  title: string
  content: string
}

const Empty: FC<EmptyProps> = ({ title, content }): JSX.Element => {
  return (
    <div className="flex flex-col justify-center items-center">
      <img src={empty} alt="Empty" className="w-24 h-24" />
      <h2 className="mb-2 font-bold text-xl">{title}</h2>
      <p className="mb-6 text-gray-700 text-sm">{content}</p>
    </div>
  )
}

export default Empty
