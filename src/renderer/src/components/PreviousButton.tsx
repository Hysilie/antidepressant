import { useNavigate } from 'react-router'

const PreviousButton = (): JSX.Element => {
  const navigate = useNavigate()

  return <button onClick={() => navigate(-1)}>Navigate Back</button>
}

export default PreviousButton
