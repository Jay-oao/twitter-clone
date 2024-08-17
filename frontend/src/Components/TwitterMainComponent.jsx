/* eslint-disable */

import React from 'react'
import { Navigate,  } from 'react-router-dom';
import TwitterCard from './TwitterCard';


function logout(auth){
  auth.setUsername('')
  auth.setAuthenticated(false);
  return <Navigate to='/'/>
}

function TwitterMainComponent() {
  return (
    <div>
      <TwitterCard/>
    </div>
  )
}

export default TwitterMainComponent