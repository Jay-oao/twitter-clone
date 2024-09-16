import React, { useEffect, useState } from 'react';
import '../css/home.css';
import logo from '../logo.svg';
import SigninModal from './SigninModal';
import SignupModal from './SignupModal';
import Cookies from 'js-cookie';
import Button from '@mui/material/Button';

const TwitterHomeComponent = () => {
  const [signInModalOpen, setSignInModalOpen] = useState(false);
  const [signUpModalOpen, setSignUpModalOpen] = useState(false);

  useEffect(() => {
    sessionStorage.clear();
    const cookieNames = ['access_token', 'refresh_token'];

    cookieNames.forEach(name => {
      Cookies.remove(name);
    });
  }, []);

  const openSignInModal = () => {
    setSignInModalOpen(true);
  };

  const closeSignInModal = () => {
    setSignInModalOpen(false);
  };

  const openSignUpModal = () => {
    setSignUpModalOpen(true);
  };

  const closeSignUpModal = () => {
    setSignUpModalOpen(false);
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <div className="container">
      <div className="logo">
        <img src={logo} alt="Twitter Logo" width="80" />
      </div>
      <h1>Welcome to Twitter Clone</h1>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleGoogleLogin}
        sx={{ mb: 2 }} n
      >
        Sign in with Google
      </Button>
      
      <Button 
        variant="contained" 
        color="primary" 
        onClick={openSignInModal}
        sx={{ mb: 2 }} 
      >
        Sign In
      </Button>
      <SigninModal isOpen={signInModalOpen} onClose={closeSignInModal} />

      <Button 
        variant="contained" 
        color="primary" 
        onClick={openSignUpModal}
        sx={{ mb: 2 }} 
      >
        Sign Up
      </Button>
      <SignupModal isOpen={signUpModalOpen} onClose={closeSignUpModal} />
    </div>
  );
};

export default TwitterHomeComponent;
