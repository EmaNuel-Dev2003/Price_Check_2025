import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Paper, Tab, Tabs } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const Login = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0); // Tab actual: 0 para login, 1 para registro

  const handleTabChange = (event, newValue) => setActiveTab(newValue);

  // Validaciones
  const loginSchema = Yup.object().shape({
    email: Yup.string().email('Correo inválido').required('El correo es obligatorio'),
    password: Yup.string().required('La contraseña es obligatoria'),
  });

  const registerSchema = Yup.object().shape({
    name: Yup.string().required('El nombre es obligatorio'),
    email: Yup.string().email('Correo inválido').required('El correo es obligatorio'),
    password: Yup.string().min(6, 'Debe tener al menos 6 caracteres').required('La contraseña es obligatoria'),
  });

  // Manejo de inicio de sesión
  const handleLogin = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await axios.post('http://localhost:5001/login', values);
      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify({ name: response.data.name, email: values.email }));
        navigate('/homepage');
      } else {
        setErrors({ email: response.data.message || 'Credenciales inválidas' });
      }
    } catch (error) {
      setErrors({ email: 'Error al intentar iniciar sesión' });
    }
    setSubmitting(false);
  };

  // Manejo de registro
  const handleRegister = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await axios.post('http://localhost:5001/register', values);
      if (response.data.success) {
        alert('Registro exitoso. Ahora puedes iniciar sesión.');
        setActiveTab(0); // Cambia a la pestaña de inicio de sesión
      } else {
        setErrors({ email: response.data.message || 'Error al registrarse' });
      }
    } catch (error) {
      setErrors({ email: 'Error al intentar registrarse' });
    }
    setSubmitting(false);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="015b86"
      sx={{
        backgroundColor: "#E3F2FD",
      }}
    >
      <Paper elevation={3} style={{ padding: '2rem', maxWidth: '400px', width: '100%' }}>
        {/* Logo encima del formulario */}
        <Box marginBottom="1rem" display="flex" justifyContent="center">
          <img src="/6811628.png" alt="Logo" style={{ width: '100px', height: 'auto' }} />
        </Box>
        <Tabs value={activeTab} onChange={handleTabChange} centered>
          <Tab label="Iniciar Sesión" />
          <Tab label="Registrarse" />
        </Tabs>

        {activeTab === 0 ? (
          <Box marginTop="1rem">
            <Typography variant="h5" textAlign="center" marginBottom="1rem" >
              Iniciar Sesión
            </Typography>
            <Formik initialValues={{ email: '', password: '' }} validationSchema={loginSchema} onSubmit={handleLogin}>
              {({ errors, touched, isSubmitting }) => (
                <Form>
                  <Box marginBottom="1rem">
                    <Field
                      name="email"
                      as={TextField}
                      label="Correo Electrónico"
                      variant="outlined"
                      fullWidth
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                    />
                  </Box>
                  <Box marginBottom="1rem">
                    <Field
                      name="password"
                      as={TextField}
                      label="Contraseña"
                      type="password"
                      variant="outlined"
                      fullWidth
                      error={touched.password && Boolean(errors.password)}
                      helperText={touched.password && errors.password}
                    />
                  </Box>
                  <Button type="submit" variant="contained" color="primary" fullWidth disabled={isSubmitting} >
                    {isSubmitting ? 'Validando...' : 'Iniciar Sesión'}
                  </Button>
                </Form>
              )}
            </Formik>
          </Box>
        ) : (
          <Box marginTop="1rem">
            <Typography variant="h5" textAlign="center" marginBottom="1rem">
              Registrarse
            </Typography>
            <Formik initialValues={{ name: '', email: '', password: '' }} validationSchema={registerSchema} onSubmit={handleRegister}>
              {({ errors, touched, isSubmitting }) => (
                <Form>
                  <Box marginBottom="1rem">
                    <Field
                      name="name"
                      as={TextField}
                      label="Nombre"
                      variant="outlined"
                      fullWidth
                      error={touched.name && Boolean(errors.name)}
                      helperText={touched.name && errors.name}
                    />
                  </Box>
                  <Box marginBottom="1rem">
                    <Field
                      name="email"
                      as={TextField}
                      label="Correo Electrónico"
                      variant="outlined"
                      fullWidth
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                    />
                  </Box>
                  <Box marginBottom="1rem">
                    <Field
                      name="password"
                      as={TextField}
                      label="Contraseña"
                      type="password"
                      variant="outlined"
                      fullWidth
                      error={touched.password && Boolean(errors.password)}
                      helperText={touched.password && errors.password}
                    />
                  </Box>
                  <Button type="submit" variant="contained" color="primary" fullWidth disabled={isSubmitting}>
                    {isSubmitting ? 'Registrando...' : 'Registrarse'}
                  </Button>
                </Form>
              )}
            </Formik>
          </Box>
        )}
      </Paper>

    </Box>
  );
};

export default Login;
