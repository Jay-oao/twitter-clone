import React, { useState ,useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import '../css/modal.css';
import { signup } from '../api/SignUpApiService';
import { useAuth } from '../security/AuthContext';
import { useNavigate } from 'react-router-dom';



const SignupModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username,setUsername] = useState('')
  const auth = useAuth();
  const navigate = useNavigate();
  
  function handleSubmit() {
    const date = new Date()
    const details = {
      username: username,
      password:password,
      email: email,
      bio:"Default Generated Bio",
      date_create:date,
      date_update:date,
    };
    signup(details)
      .then(response => {
        if (response.status === 200) {
          auth.setUsername(username)
          auth.setAuthenticated(true)
          
          setTimeout(()=>{
            navigate('/home')
          },5000)
        
        }
      })
      .catch(error => console.log(error));
  }

  useEffect(() => {
    if (!isOpen) {
      setEmail('')
      setPassword('')
      setUsername('')
    }
  }, [isOpen]);

  if (!isOpen) return null;



  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-btn" onClick={onClose}>Close</button>
        <div className="modal-content">
          <h1 className='heading-modal'>Sign up</h1>
          <h2>Access the world of 'X' clone now</h2>
          <Formik
            initialValues={{email,password}}
            onSubmit={handleSubmit}
          >
            {() => (
              <Form>

                <fieldset className="form-group">
                  <label>Email</label>
                  <Field
                    type="text"
                    className="form-control"
                    name="email"
                    placeholder="JohnDoe@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </fieldset>

                <fieldset className="form-group">
                  <label>Username</label>
                  <Field
                    type="text"
                    className="form-control"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </fieldset>

                <fieldset className="form-group">
                  <label>Password</label>
                  <Field
                    type="password"
                    className="form-control"
                    name="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </fieldset>
                <button type="submit" className="btn btn-primary">Sign In</button>
              </Form>
            )}
          </Formik>
          {auth.Authenticated && <div>User Created : Redirecting to home page </div>}
        </div>
      </div>
    </div>
  );
};

export default SignupModal