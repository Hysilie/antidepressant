import { routes } from '@renderer/utils/routes'
import { Link } from 'react-router'

const HomeScreen = (): JSX.Element => {
  const { settings, todo, player, journal } = routes

  return (
    <div>
      Home
      <ul>
        <li>
          <Link to={settings}>Settings Screen</Link>
        </li>
        <li>
          <Link to={todo}>Todo Screen</Link>
        </li>
        <li>
          <Link to={player}>PlayerScreen Screen</Link>
        </li>
        <li>
          <Link to={journal}>Journal Screen</Link>
        </li>
      </ul>
    </div>
  )
}

export default HomeScreen
