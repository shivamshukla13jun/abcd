import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.scss';
import App from './App.jsx';
import ToastContainer from '@components/common/ToastContainer';
import { Provider } from 'react-redux';
import store, { persistor } from '@redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import ErrorBoundary from '@components/common/ErrorBoundary';
import 'recharts';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
        <ToastContainer /> {/* Render the ToastContainer globally */}
      </PersistGate>
    </Provider>
    </ErrorBoundary>
  </StrictMode>
);
