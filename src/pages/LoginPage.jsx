import React from 'react';
import Login from '../components/Auth/Login';

const LoginPage = ({ setShowRegister }) => {
  return <Login setShowRegister={setShowRegister} />;
};

export default LoginPage;