import React, { useState ,useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import '../css/modal.css';
import {  signin } from '../api/SignInApiService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../security/AuthContext';


const SigninModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const auth = useAuth();

  const handleSubmit = (values, { setSubmitting }) => {

    const loginRequest ={
      email : email,
      password : password
    }

    signin(loginRequest)
      .then(
        (response)=>{
          if(response.status===200){
            auth.setAuthenticated(true);
            sessionStorage.setItem("username",response.data.username)
            sessionStorage.setItem("id",response.data.id)
            sessionStorage.setItem("email",response.data.email);
            setTimeout(()=>navigate('/home'),1500)
          } 
        }
      )
      .catch(error=>{
        if(error.status===500){
          console.log("User does not exist in database")
        }
      })



  };

  useEffect(() => {
    if (!isOpen) {
      setEmail('');
      setPassword('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-btn" onClick={onClose}>Close</button>
        <div className="modal-content">
          <h1 className='heading-modal'>Sign In</h1>
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
        </div>
      </div>
    </div>
  );
};

export default SigninModal
