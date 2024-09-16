import React, { useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import { TextField, Button, Modal, Typography, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { signup } from '../api/SignUpApiService';
import { useAuth } from '../security/AuthContext';
import { useNavigate } from 'react-router-dom';

const SignupModal = ({ isOpen, onClose }) => {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (values, { setSubmitting, setErrors }) => {
    const date = new Date();
    const details = {
      username: values.username,
      password: values.password,
      email: values.email,
      bio: "Default Generated Bio",
      date_create: date,
      date_update: date,
    };

    signup(details)
      .then(response => {
        if (response.status === 200) {
          auth.setUsername(values.username);
          auth.setAuthenticated(true);
          setTimeout(() => navigate('/home'), 5000);
        }
      })
      .catch(error => {
        console.error("Signup error:", error);
        setErrors({ general: 'An error occurred during signup. Please try again.' });
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
          Sign Up
        </Typography>
        <Typography variant="subtitle1" paragraph>
          Access the world of 'X' clone now
        </Typography>
        <Formik
          initialValues={{ email: '', password: '', username: '' }}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors }) => (
            <Form style={{ width: '100%' }}>
              {errors.general && <Typography color="error" sx={{ mb: 2 }}>{errors.general}</Typography>}

              <Field
                name="email"
                as={TextField}
                fullWidth
                margin="normal"
                id="email"
                label="Email"
                type="email"
                placeholder="JohnDoe@email.com"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                autoComplete="email" 
              />

              <Field
                name="username"
                as={TextField}
                fullWidth
                margin="normal"
                id="username"
                label="Username"
                type="text"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                autoComplete="username" 
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
                autoComplete="new-password" 
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                fullWidth
                sx={{ mt: 2 }}
              >
                Sign Up
              </Button>
            </Form>
          )}
        </Formik>
        {auth.Authenticated && <Typography sx={{ mt: 2 }}>User Created: Redirecting to home page</Typography>}
      </Box>
    </Modal>
  );
};

export default SignupModal;
