import { CSSProperties, FC } from 'react'

type TitleProps = {
  label: string
  style?: CSSProperties
}

const Title: FC<TitleProps> = ({ label, style }): JSX.Element => (
  <h1 className="py-2 max-w-full font-title text-2xl text-center truncate" style={style}>
    {label}
  </h1>
)

export default Title
