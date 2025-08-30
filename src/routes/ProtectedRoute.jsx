import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { isLoggedIn } from '../utils/auth';

export default function ProtectedRoute() {
  const logged = isLoggedIn();
  const location = useLocation();
  if (!logged) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}
