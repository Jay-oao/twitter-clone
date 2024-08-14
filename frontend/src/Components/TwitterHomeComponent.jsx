import React from 'react';
import '../css/home.css'
import logo from '../logo.svg'
import { useState } from 'react';
import SigninModal from './SigninModal'
import SignupModal from './SignupModal';

const TwitterHomeComponent = () => {
  const [signInModalOpen, setSignInModalOpen] = useState(false);
  const [signUpModalOpen, setSignUpModalOpen] = useState(false);

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

  return (
    <div className="container" >
      <div className="logo">
        <img src={logo} alt="Twitter Logo" width="80" />
      </div>
      <h1>Welcome to Twitter Clone</h1>
      <a className="button" href='/'>Sign in with Google</a>
      

      <button onClick={openSignInModal}>Sign In</button>
      <SigninModal isOpen={signInModalOpen} onClose={closeSignInModal} />

      <button onClick={openSignUpModal}>Sign Up</button>
      <SignupModal isOpen={signUpModalOpen} onClose={closeSignUpModal} />
    </div>
  );
};

export default TwitterHomeComponent;
