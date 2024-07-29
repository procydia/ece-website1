import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/Store';
import { loadUser } from './actions/authActions';
import setAuthToken from './utils/setAuthToken';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Profile from './components/profile/Profile';
import ProductList from './components/products/ProductList';
import HomePage from './components/home/HomePage'; // Import HomePage component

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} /> {/* HomePage route */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/products" element={<ProductList />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
};

export default App;
