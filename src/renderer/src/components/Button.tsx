import { CSSProperties, FC } from 'react'

type ButtonProps = {
  onClick?: () => void
  label: string
  type: HTMLButtonElement['type']
  style?: CSSProperties
}

const Button: FC<ButtonProps> = ({ onClick, label, type, style }) => {
  return (
    <button
      onClick={onClick}
      type={type ?? 'button'}
      style={style}
      className="bg-white hover:bg-surface-dark my-2 px-4 py-2 border-4 border-black rounded-xl w-full font-title uppercase hover:scale-105 transition-transform duration-300"
    >
      {label}
    </button>
  )
}

export default Button
