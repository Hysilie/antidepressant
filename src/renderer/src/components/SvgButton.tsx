import { FC } from 'react'

type SvgButtonProps = {
  src: string
  onClick: () => void
  size: number
  alt: string
  className?: string
}

const SvgButton: FC<SvgButtonProps> = ({ src, onClick, size, alt, className }): JSX.Element => {
  return (
    <img
      src={src}
      alt={alt}
      style={{ width: `${size}px`, height: `${size}px` }}
      className={`hover:scale-125 transition-all duration-300 ease-in-out cursor-pointer ${className && className}`}
      onClick={onClick}
    />
  )
}

export default SvgButton
