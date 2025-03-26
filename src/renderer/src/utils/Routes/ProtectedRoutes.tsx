import { useAuth } from '@renderer/providers/Auth/useAuth'
import { Navigate, Outlet } from 'react-router'
import { routes } from './routes'

const ProtectedRoute = (): JSX.Element => {
  const { currentUser, loading } = useAuth()
  if (loading) return <div>Loading...</div>

  if (!currentUser) {
    return <Navigate to={routes.login} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
