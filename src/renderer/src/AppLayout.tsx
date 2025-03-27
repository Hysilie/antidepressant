import { Outlet } from 'react-router'

const AppLayout = (): JSX.Element => {
  return (
    <main>
      <Outlet />
    </main>
  )
}

export default AppLayout
