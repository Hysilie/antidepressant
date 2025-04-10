import { CSSProperties, FC } from 'react'
import clsx from 'clsx'
import mascot from '../assets/icons/mascot.svg'

type ButtonProps = {
  onClick?: () => void
  label: string
  type?: HTMLButtonElement['type']
  style?: CSSProperties
  mode?: 'inline'
  iconLeft?: JSX.Element
  color?: string
  loading?: boolean
  disabled?: boolean
}

const CLASSIC =
  'bg-white flex gap-2 items-center justify-center hover:bg-surface-dark my-2 px-4 border-2 py-2 border-black rounded-xl w-full font-title uppercase hover:scale-105 transition-transform duration-300'
const INLINE =
  'flex gap-2 items-center hover:scale-105 transition-transform duration-300 font-semibold'

const Spinner = (): JSX.Element => (
  <img src={mascot} className="me-2 w-6 h-6 text-gray-200 animate-[spin_3s_linear_infinite]" />
)

const Button: FC<ButtonProps> = ({
  onClick,
  label,
  type = 'button',
  style,
  mode,
  iconLeft,
  color,
  loading = false,
  disabled = false
}) => {
  return (
    <button
      onClick={onClick}
      type={type}
      className={clsx(
        mode === 'inline' ? INLINE : CLASSIC,
        color,
        (disabled || loading) && 'opacity-50 cursor-not-allowed'
      )}
      style={style}
      disabled={disabled || loading}
    >
      {loading ? <Spinner /> : iconLeft}
      {label}
    </button>
  )
}

export default Button
