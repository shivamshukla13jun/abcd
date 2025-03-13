import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { publicRoutes, protectedRoutes } from './routes';
import Layout from '@components/common/Layout';

const LoadingFallback = () => (
  <div className="page-loader">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

// Auth wrapper components
const AuthenticatedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector(state => state.user);
  return isAuthenticated ? <Navigate to="/" /> : children;
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useSelector(state => state.user);
  const role = user?.role;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && (!role || !allowedRoles.some(allowedRole => 
    Array.isArray(role) ? role.includes(allowedRole) : role === allowedRole
  ))) {
    return <Navigate to="/not-authorized" />;
  }

  return children;
};

// Recursive function to render routes
const renderRoutes = (routes) => {
  return routes.map(route => {
    // Create the route element with protection and suspense
    const RouteElement = () => (
      <ProtectedRoute allowedRoles={route.allowedRoles}>
        <Suspense fallback={<LoadingFallback />}>
          {route.element && <route.element />}
        </Suspense>
      </ProtectedRoute>
    );

    // If the route has children, recursively render them
    if (route.children) {
      return [
        // Render the parent route if it has an element
        route.element && (
          <Route
            key={route.path}
            path={route.path}
            element={<RouteElement />}
          />
        ),
        // Recursively render child routes
        ...renderRoutes(route.children)
      ].filter(Boolean); // Filter out undefined elements (when parent has no element)
    }

    // Render a single route
    return (
      <Route
        key={route.path}
        path={route.path}
        element={<RouteElement />}
      />
    );
  });
};

// Render public routes
const renderPublicRoutes = (routes) => {
  return routes.map(({ path, element: Element }) => (
    <Route
      key={path}
      path={path}
      element={
        path === '/404' || path === '/not-authorized' ? (
          <Suspense fallback={<LoadingFallback />}>
            <Element />
          </Suspense>
        ) : (
          <AuthenticatedRoute>
            <Suspense fallback={<LoadingFallback />}>
              <Element />
            </Suspense>
          </AuthenticatedRoute>
        )
      }
    />
  ));
};

const RouterConfig = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public Routes */}
        {renderPublicRoutes(publicRoutes)}

        {/* Protected Routes with Layout */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {renderRoutes(protectedRoutes)}
        </Route>

        {/* Catch all route - redirect to 404 */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
};

export default RouterConfig;
