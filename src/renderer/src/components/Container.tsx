import { CSSProperties, FC, PropsWithChildren } from 'react'
import clsx from 'clsx'

type ContainerProps = {
  spacing: 'small' | 'medium' | 'large'
  style?: CSSProperties
  primary?: boolean
  className?: string
}

const SPACING = { small: 'p-2', medium: 'p-4', large: 'px-6 py-2' }

const Container: FC<PropsWithChildren<ContainerProps>> = ({
  children,
  spacing,
  style,
  primary,
  className
}) => {
  return (
    <div
      className={clsx('h-full', SPACING[spacing], primary && 'bg-primary', className && className)}
      style={style}
    >
      {children}
    </div>
  )
}

export default Container
