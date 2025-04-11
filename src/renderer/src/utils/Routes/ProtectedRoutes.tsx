import { useAuth } from '@renderer/providers/Auth/useAuth'
import { Outlet, Navigate } from 'react-router-dom'
import { routes } from './routes'
import Loader from '@renderer/components/Loader'

const ProtectedRoute = (): JSX.Element => {
  const { currentUser, loading } = useAuth()

  if (loading) return <Loader />

  if (!currentUser) {
    return <Navigate to={routes.login} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
