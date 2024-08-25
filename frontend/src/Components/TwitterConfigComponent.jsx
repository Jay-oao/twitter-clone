/* eslint-disable */

import TwitterHomeComponent from './TwitterHomeComponent';
import ErrorComponent from './ErrorComponent';
import TwitterMainComponent from './TwitterMainComponent';
import {BrowserRouter, Routes, Route , Navigate} from 'react-router-dom'
import AuthProvider from '../security/AuthContext';
import { useAuth } from '../security/AuthContext';
import TweetComponent from '../SocketConfig/config';
import ChatHome from './ChatHome';
import ChatCard from './ChatCard';
import ProfileComponent from './ProfileComponent';

//TODO: Refactor formik returned values 

//TODO: Fix/Better API responses for signup 

function Authenticate({children}){
  const AuthContext = useAuth()
  if(AuthContext.Authenticated)
      return children
  return <Navigate to='/'/>
}



function TwitterConfigComponent() {
  return (
    <>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path='/' element={ <TwitterHomeComponent/> }/>
          

          <Route path='/home' element ={ 
            //<Authenticate>
                <TwitterMainComponent/>
            //</Authenticate>
            } />
          <Route path='*' element = { <ErrorComponent/> }/>
          <Route path='ws' element={<TweetComponent/>}/>
          <Route path='chat' element={<ChatHome/>}></Route>
          <Route path='chat/dm' element={<ChatCard/>}></Route>
          <Route path='/profile' element={<ProfileComponent/>}/>
          <Route path="/profile/:profileId" element={<ProfileComponent />} />
        </Routes>
      
      </AuthProvider>
    
    </BrowserRouter>
    </>
  )
}

export default TwitterConfigComponent;
