import { FC } from 'react'

type SvgButtonProps = {
  src: string
  onClick?: () => void
  size: number
  alt: string
  className?: string
  onMouseOver?: () => void
  onMouseLeave?: () => void
  onMouseEnter?: () => void
}

const SvgButton: FC<SvgButtonProps> = ({
  src,
  onClick,
  size,
  alt,
  className,
  onMouseLeave,
  onMouseOver,
  onMouseEnter
}): JSX.Element => {
  return (
    <img
      src={src}
      alt={alt}
      style={{ width: `${size}px`, height: `${size}px` }}
      className={`hover:scale-125 transition-all duration-300 ease-in-out cursor-pointer ${className && className}`}
      onClick={onClick}
      role="button"
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
      onMouseEnter={onMouseEnter}
    />
  )
}

export default SvgButton
