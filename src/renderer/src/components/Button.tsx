import { CSSProperties, FC } from 'react'
import clsx from 'clsx'

type ButtonProps = {
  onClick?: () => void
  label: string
  type: HTMLButtonElement['type']
  style?: CSSProperties
  mode?: 'inline'
  iconLeft?: JSX.Element
  color?: string
}

const CLASSIC =
  'bg-white flex gap-2 items-center justify-center hover:bg-surface-dark my-2 px-4 border-2 py-2 border-black rounded-xl w-full font-title uppercase hover:scale-105 transition-transform duration-300'
const INLINE = 'flex gap-2 hover:scale-105 transition-transform duration-300 font-semibold'

const Button: FC<ButtonProps> = ({ onClick, label, type, style, mode, iconLeft, color }) => {
  return (
    <button
      onClick={onClick}
      type={type ?? 'button'}
      className={clsx(mode === 'inline' ? INLINE : (CLASSIC ?? CLASSIC), color)}
      style={style}
    >
      {iconLeft ? iconLeft : null}
      {label}
    </button>
  )
}

export default Button
