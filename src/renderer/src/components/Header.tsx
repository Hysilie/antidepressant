import { FC } from 'react'
import Title from './Title'
import back from '../assets/icons/back.svg'
import { useNavigate } from 'react-router'

type HeaderProps = {
  extraButton?: JSX.Element
  icon?: boolean
  title: string
  target: string
  className?: string
}

const Header: FC<HeaderProps> = ({
  icon = true,
  extraButton,
  title,
  target,
  className
}): JSX.Element => {
  const navigate = useNavigate()

  return (
    <div className={`flex items-center gap-4 ${className && className}`}>
      {icon && (
        <img
          src={back}
          alt="back"
          height={24}
          width={24}
          onClick={() => navigate(target)}
          className="hover:scale-110 transition-transform duration-300 cursor-pointer"
        />
      )}
      <div className="flex flex-1 justify-start truncate">
        <Title label={title} />
      </div>
      <div className="flex flex-grow-1 justify-end w-6">{extraButton}</div>
    </div>
  )
}

export default Header
