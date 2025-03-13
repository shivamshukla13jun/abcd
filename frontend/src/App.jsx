import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import RouterConfig from './routes/RouterConfig';
import './App.scss';
import { useGlobalNumericInputPrevention } from './hooks/useGlobalNumericInputPrevention ';

const App = () => {
  useGlobalNumericInputPrevention({
    allowNegative: false,
    preventArrows: true
  });
  return (
    <Provider store={store}>
      <Router>
        <RouterConfig />
      </Router>
    </Provider>
  );
};

export default App;
