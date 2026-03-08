import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

// Захищений маршрут (HOC)
const ProtectedRoute = ({ redirectPath = '/login', children }) => {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    // replace: true важливо для чистої історії браузера
    return <Navigate to={redirectPath} replace />;
  }

  // Якщо є children — рендеримо їх, інакше Outlet для вкладених маршрутів
  return children ? children : <Outlet />;
};

export default ProtectedRoute;



