import { useState } from 'react';
import { 
  Container, Box, Typography, TextField, Button, Paper, 
  Alert, Link, InputAdornment, IconButton 
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff, Login as LoginIcon } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import PageHeader from '../components/common/PageHeader';

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(null);
  
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Ingresa un correo electrónico válido')
      .required('El correo electrónico es requerido'),
    password: Yup.string()
      .required('La contraseña es requerida')
  });
  
  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema,
    onSubmit: (values) => {
      // Simulación de login exitoso
      console.log('Login attempt:', values);
      
      // Simular llamada a API
      setTimeout(() => {
        // Para simular error de login:
        // setLoginError('Credenciales inválidas. Intenta de nuevo.');
        
        // Para simular login exitoso:
        navigate('/dashboard');
      }, 1000);
    }
  });
  
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <Container maxWidth="sm">
      <PageHeader 
        title="Iniciar Sesión" 
        subtitle="Accede a tu cuenta de MentorTech UTSJR" 
      />
      
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        {loginError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {loginError}
          </Alert>
        )}
        
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Correo Institucional"
            placeholder="ejemplo@utsjr.edu.mx"
            variant="outlined"
            margin="normal"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          
          <TextField
            fullWidth
            id="password"
            name="password"
            label="Contraseña"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            margin="normal"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          
          <Box sx={{ mt: 2, mb: 3, textAlign: 'right' }}>
            <Link component={RouterLink} to="/forgot-password">
              ¿Olvidaste tu contraseña?
            </Link>
          </Box>
          
          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            startIcon={<LoginIcon />}
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </form>
        
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2">
            ¿No tienes una cuenta?{' '}
            <Link component={RouterLink} to="/register">
              Regístrate aquí
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;