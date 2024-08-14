import React from 'react';
import '../css/header.css'; 
import logo from '../logo.svg'; 
import { Link } from 'react-router-dom';


const HeaderComponent = () => {
    return (
      <div className="header-bar">
        <Link to="/profile">Profile</Link>
        <img src={logo} alt="Logo" className="logo1" />
        <Link to="/chat">Chat</Link>

      </div>
    );
};

export default HeaderComponent;
