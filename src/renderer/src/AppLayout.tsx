import { Outlet } from 'react-router-dom'

const AppLayout = (): JSX.Element => {
  return (
    <main className="h-full font-body">
      <Outlet />
    </main>
  )
}

export default AppLayout
