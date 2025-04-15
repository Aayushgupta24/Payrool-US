import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'employer' | 'employee';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const location = useLocation();
  
  const getUserFromStorage = () => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
  };

  const user = getUserFromStorage();

  // If there's no user, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Allow admin to access all routes
  if (user.role === 'admin') {
    return <>{children}</>;
  }

  // For non-admin users, check role restrictions
  if (requiredRole && user.role !== requiredRole) {
    const roleRedirectMap = {
      admin: '/admin',
      employer: '/employer/dashboard',
      employee: '/employee/dashboard'
    };
    
    const redirectTo = roleRedirectMap[user.role as keyof typeof roleRedirectMap] || '/login';
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;


