import React, { useEffect } from 'react';
import '../css/home.css'
import logo from '../logo.svg'
import { useState } from 'react';
import SigninModal from './SigninModal'
import SignupModal from './SignupModal';
import Cookies from 'js-cookie';

const TwitterHomeComponent = () => {
  const [signInModalOpen, setSignInModalOpen] = useState(false);
  const [signUpModalOpen, setSignUpModalOpen] = useState(false);

  useEffect(()=>{
    sessionStorage.clear()
    const cookieNames = ['access_token', 'refresh_token']

    cookieNames.forEach(name => {
        Cookies.remove(name);
    });

  },[])

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

  const handleGoogleLogin = ()=>{
     window.location.href = "http://localhost:8080/oauth2/authorization/google"
  }

  return (
    <div className="container" >
      <div className="logo">
        <img src={logo} alt="Twitter Logo" width="80" />
      </div>
      <h1>Welcome to Twitter Clone</h1>
      <button className="button" onClick={handleGoogleLogin}>Sign in with Google</button>
      

      <button onClick={openSignInModal}>Sign In</button>
      <SigninModal isOpen={signInModalOpen} onClose={closeSignInModal} />

      <button onClick={openSignUpModal}>Sign Up</button>
      <SignupModal isOpen={signUpModalOpen} onClose={closeSignUpModal} />
    </div>
  );
};

export default TwitterHomeComponent;
