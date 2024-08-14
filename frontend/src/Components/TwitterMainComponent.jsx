/* eslint-disable */

import React from 'react'
import { useAuth } from '../security/AuthContext'
import { Navigate,  } from 'react-router-dom';
import TwitterCard from './TwitterCard';


function logout(auth){
  auth.setUsername('')
  auth.setAuthenticated(false);
  return <Navigate to='/'/>
}

function TwitterMainComponent() {
  const auth = useAuth();
  console.log(auth.username);
  return (
    <div>
      <TwitterCard/>
    </div>
  )
}

export default TwitterMainComponent