// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import PrivateRoute from './PrivateRoute';
import Dashboard from './components/Dashboard';
import Login from './Login';
import Signup from './Signup';
import Home from './Home';
// import Users from './components/Users';
import './App.css';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="App">


          {/* Routes for main content */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            {/* <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} /> */}
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            {/* <Route path="/users" element={<Users /> } /> */}
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
