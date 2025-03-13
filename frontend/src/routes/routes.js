import PaymentTermsList from '@/components/PaymentTerms/PaymentTermsList';
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// Lazily import components
const Dashboard = lazy(() => import('@pages/DashBoard'));
const CreateLoad = lazy(() => import('@pages/Load/CreateLoad'));
const ViewLoad = lazy(() => import('@pages/Load/ViewLoad'));
const EditLoad = lazy(() => import('@pages/EditLoad/EditLoad'));
const Customers = lazy(() => import('@pages/Customers/ViewCustomers'));
const Documents = lazy(() => import('@pages/Documents/ViewDocuments'));
const Login = lazy(() => import('@pages/AuthService/Login'));
const Register = lazy(() => import('@pages/AuthService/Register'));
const ForgetPassword = lazy(() => import('@pages/AuthService/ForgetPassword'));
const Payments = lazy(() => import('@pages/Accounting/Payments'));
const Invoices = lazy(() => import('@pages/Accounting/Invoices'));
const Expenses = lazy(() => import('@pages/Accounting/Expenses'));
const Ratings = lazy(() => import('@pages/Accounting/Ratings'));
const NotAuthorized = lazy(() => import('@pages/NotAuthorized'));
const NotFound = lazy(() => import('@pages/NotFound'));

// Define roles
export const Roles = {
  ACCOUNTING: 'accounting',
  DISPATCHER: 'dispatcher',
  CUSTOMER: 'customer',
  SHIPPER: 'shipper',
  ADMIN: 'admin',
  SUPERADMIN: 'superadmin',
  CARRIER: 'carrier',
  MANAGER: 'manager',
};

// Function to generate routes recursively
const generateRoutes = (routes, parentPath = '') => {
  return routes.map(route => {
    // Create full path by combining parent path and current route path
    const fullPath = `${parentPath}${route.path}`.replace('//', '/');
    
    const newRoute = {
      ...route,
      path: fullPath,
    };

    // If route has children, process them recursively
    if (route.children) {
      newRoute.children = generateRoutes(route.children, fullPath);
    }

    return newRoute;
  });
};

// Base routes configuration
const baseProtectedRoutes = [
  {
    path: '/',
    element: Dashboard,
    title: 'Dashboard',
    icon: 'dashboard',
    allowedRoles: [Roles.ADMIN, Roles.DISPATCHER, Roles.ACCOUNTING, Roles.MANAGER],
  },
  {
    path: '/loads',
    element: ViewLoad,
    title: 'Loads',
    icon: 'truck',
    allowedRoles: [Roles.ADMIN, Roles.DISPATCHER, Roles.MANAGER],
  },
  {
    path: '/createload',
    element: CreateLoad,
    title: 'Create Load',
    icon: 'plus',
    hideInMenu: true,
    allowedRoles: [Roles.ADMIN, Roles.DISPATCHER],
  },
  {
    path: '/editload/:loadId',
    element: EditLoad,
    title: 'Edit Load',
    icon: 'edit',
    hideInMenu: true,
    allowedRoles: [Roles.ADMIN, Roles.DISPATCHER],
  },
  {
    path: '/customers',
    element: Customers,
    title: 'Customers',
    icon: 'users',
    allowedRoles: [Roles.ADMIN, Roles.MANAGER],
  },
  {
    path: '/documents',
    element: Documents,
    title: 'Documents',
    icon: 'file',
    allowedRoles: [Roles.ADMIN, Roles.DISPATCHER, Roles.ACCOUNTING, Roles.MANAGER],
  },
  {
    path: '/accounting',
    title: 'Accounting',
    icon: 'accounting',
    allowedRoles: [Roles.ADMIN, Roles.ACCOUNTING, Roles.MANAGER],
    children: [
      {
        path: '/payments',
        element: Payments,
        title: 'Payments',
        icon: 'payments',
        allowedRoles: [Roles.ADMIN, Roles.ACCOUNTING],
        children: [
          {
            path: '/payment-terms',
            element: PaymentTermsList,
            title: 'Payment Terms',
            icon: 'payment-terms',
            allowedRoles: [Roles.ADMIN, Roles.ACCOUNTING],
          }
        ]
      },
      {
        path: '/invoices',
        element: Invoices,
        title: 'Invoices',
        icon: 'invoices',
        allowedRoles: [Roles.ADMIN, Roles.ACCOUNTING],
      },
      {
        path: '/expenses',
        element: Expenses,
        title: 'Expenses',
        icon: 'expenses',
        allowedRoles: [Roles.ADMIN, Roles.ACCOUNTING],
      },
      {
        path: '/ratings',
        element: Ratings,
        title: 'Ratings',
        icon: 'ratings',
        allowedRoles: [Roles.ADMIN, Roles.ACCOUNTING, Roles.MANAGER],
      }
    ]
  },
];

// Function to flatten routes for React Router
const flattenRoutes = (routes) => {
  return routes.reduce((acc, route) => {
    // Add current route
    acc.push(route);
    if (route.children) {
      acc.push(...flattenRoutes(route.children));
    }
    return acc;
  }, []);
};

export const publicRoutes = [
  {
    path: '/login',
    element: Login,
    title: 'Login',

  },
  {
    path: '/register',
    element: Register,
    title: 'Register',
  },
  {
    path: '/404',
    element: NotFound,
    title: '404',
  },
  // forget password
  {
    path: '/forget-password',
    element: ForgetPassword,
    title: 'Forget Password',
  },
  // not authorized
  {
    path: '/403',
    element: NotAuthorized,
    title: '403',
  },
  // wild card route
  {
    path: '*',
    element: NotFound,
    title: '404',
  },


  
];
export const protectedRoutes = generateRoutes(baseProtectedRoutes);