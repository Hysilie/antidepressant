import { FC } from 'react'
import { useNavigate } from 'react-router'

interface PreviousButtonProps {
  action?: () => void
}

const PreviousButton: FC<PreviousButtonProps> = ({ action }): JSX.Element => {
  const navigate = useNavigate()
  const navigateBack = (): Promise<void> | void => {
    if (action) {
      action()
    } else {
      navigate(-1)
    }
  }

  return <button onClick={navigateBack}>Navigate Back</button>
}

export default PreviousButton
