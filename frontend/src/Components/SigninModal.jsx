import React, { useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import { TextField, Button, Modal, Typography, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { signin } from '../api/SignInApiService';
import { useNavigate } from 'react-router-dom';

const SigninModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleSubmit = (values, { setSubmitting, setErrors }) => {
    const loginRequest = {
      email: values.email,
      password: values.password,
    };
    console.log(loginRequest);
    signin(loginRequest)
      .then(response => {
        if (response.status === 200) {
          sessionStorage.setItem("username", response.data.username);
          sessionStorage.setItem("id", response.data.id);
          sessionStorage.setItem("email", response.data.email);
          setTimeout(() => navigate('/home'), 1500);
        }
      })
      .catch(error => {
        console.error("Error during sign-in:", error);
        setErrors({ email: 'An error occurred during sign-in. Please try again.' });
      })
      .finally(() => setSubmitting(false));
  };

  useEffect(() => {
    if (!isOpen) {
      // Formik will handle resetting form values
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box className="modal-content" sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: 600,
        bgcolor: 'background.paper',
        p: 3,
        borderRadius: 2,
        boxShadow: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <IconButton className="close-btn" onClick={onClose} sx={{ position: 'absolute', top: 10, right: 10 }}>
          <CloseIcon />
        </IconButton>
        <Typography variant="h4" component="h1" gutterBottom>
          Sign In
        </Typography>
        <Formik
          initialValues={{ email: '', password: '' }}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors }) => (
            <Form style={{ width: '100%' }}>
              {errors.email && <Typography color="error" sx={{ mb: 2 }}>{errors.email}</Typography>}
              
              <Field
                name="email"
                as={TextField}
                fullWidth
                margin="normal"
                id="email"
                label="Email"
                type="email"
                placeholder="Enter your email"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                autoComplete = "email"
              />

              <Field
                name="password"
                as={TextField}
                fullWidth
                margin="normal"
                id="password"
                label="Password"
                type="password"
                placeholder="Enter your password"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                autoComplete ="curr-password"
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                fullWidth
                sx={{ mt: 2 }}
              >
                Sign In
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
};

export default SigninModal;
