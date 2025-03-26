import { ReactNode } from 'react'
import { Outlet } from 'react-router'

const AppLayout = (): JSX.Element => {
  const renderActionButton = (): ReactNode => <button>Action</button>

  return (
    <div>
      <header className="flex gap">
        <h1>Title Screen</h1>
        {renderActionButton()}
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
