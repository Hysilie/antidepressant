import { CSSProperties, FC, PropsWithChildren } from 'react'
import clsx from 'clsx'

type ContainerProps = {
  spacing: 'small' | 'medium' | 'large'
  style?: CSSProperties
  primary?: boolean
}

const SPACING = { small: 'p-2', medium: 'p-4', large: 'p-6' }

const Container: FC<PropsWithChildren<ContainerProps>> = ({
  children,
  spacing,
  style,
  primary
}) => {
  return (
    <div className={clsx('h-full', SPACING[spacing], primary && 'bg-primary')} style={style}>
      {children}
    </div>
  )
}

export default Container
