import React from 'react';
import './App.css'; 

const LoginButton = () => {
  return (
    <div className="button-container">
      <a href="http://localhost:5000/auth/google" className="button">Login with Google</a>
      <a href="http://localhost:5000/api/check-invoices" className="button">Send Email</a>
      <a href="http://localhost:5000/api/logout" className="button">Logout</a>
    </div>
  );
};

export default LoginButton;
