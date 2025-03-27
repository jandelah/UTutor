import { useState } from 'react';
import { 
  Container, Paper, Box, Typography, Stepper, Step, 
  StepLabel, Button, TextField, MenuItem, FormControl, 
  FormLabel, RadioGroup, FormControlLabel, Radio, 
  Checkbox, FormHelperText, Grid, Alert 
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import { useAuth } from '../AuthContext.jsx';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [registerError, setRegisterError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const steps = ['Información Personal', 'Detalles Académicos', 'Preferencias de Mentoría'];
  
  // Esquemas de validación para cada paso (simplificados para facilitar el registro de demostración)
  const validationSchemas = [
    // Paso 1: Información Personal
    Yup.object({
      firstName: Yup.string().required('Nombre requerido'),
      lastName: Yup.string().required('Apellido requerido'),
      email: Yup.string()
        .email('Correo electrónico inválido')
        .required('Correo electrónico requerido'),
      password: Yup.string()
        .min(4, 'La contraseña debe tener al menos 4 caracteres')
        .required('Contraseña requerida'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Las contraseñas deben coincidir')
        .required('Confirmar contraseña requerida'),
      termsAccepted: Yup.boolean()
        .oneOf([true], 'Debes aceptar los términos y condiciones')
    }),
    
    // Paso 2: Detalles Académicos
    Yup.object({
      studentId: Yup.string().required('Matrícula requerida'),
      career: Yup.string().required('Carrera requerida'),
      semester: Yup.number()
        .required('Semestre requerido')
        .min(1, 'El semestre debe ser al menos 1')
        .max(10, 'El semestre máximo es 10'),
    }),
    
    // Paso 3: Preferencias de Mentoría
    Yup.object({
      role: Yup.string().required('Selecciona un rol'),
      interests: Yup.array()
        .when('role', {
          is: 'MENTEE',
          then: () => Yup.array().min(1, 'Selecciona al menos un área de interés'),
          otherwise: () => Yup.array()
        }),
      expertise: Yup.array()
        .when('role', {
          is: 'MENTOR',
          then: () => Yup.array().min(1, 'Selecciona al menos un área de expertise'),
          otherwise: () => Yup.array()
        })
    })
  ];
  
  const formik = useFormik({
    initialValues: {
      // Paso 1
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      termsAccepted: false,
      
      // Paso 2
      studentId: '',
      career: '',
      semester: '',
      
      // Paso 3
      role: 'MENTEE',
      interests: [],
      expertise: []
    },
    validationSchema: validationSchemas[activeStep],
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      if (activeStep < steps.length - 1) {
        handleNext();
      } else {
        try {
          setIsSubmitting(true);
          await register(values);
          navigate('/dashboard');
        } catch (error) {
          setRegisterError(error.message);
        } finally {
          setIsSubmitting(false);
        }
      }
    }
  });
  
  const handleNext = () => {
    const currentSchema = validationSchemas[activeStep];
    
    // Validate current step fields
    try {
      currentSchema.validateSync(formik.values, { abortEarly: false });
      setActiveStep((prevStep) => prevStep + 1);
    } catch (err) {
      // Validate and show errors
      const errors = {};
      if (err.inner) {
        err.inner.forEach((e) => {
          errors[e.path] = e.message;
        });
      }
      formik.setErrors(errors);
      formik.setTouched(
        Object.keys(errors).reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {})
      );
    }
  };
  
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  // Lista de carreras disponibles
  const careers = [
    'Desarrollo de Software',
    'Redes y Telecomunicaciones',
    'Mecatrónica',
    'Procesos Industriales',
    'Mantenimiento Industrial',
    'Energías Renovables',
    'Administración'
  ];
  
  // Lista de intereses/expertise
  const topicOptions = [
    'Programación Web',
    'Desarrollo Móvil',
    'Bases de Datos',
    'Algoritmos',
    'Inteligencia Artificial',
    'Diseño UX/UI',
    'Redes',
    'Seguridad Informática',
    'Sistemas Operativos',
    'IoT',
    'Cloud Computing',
    'DevOps'
  ];
  
  // Renderizar contenido según el paso actual
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Información Personal
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="firstName"
                  name="firstName"
                  label="Nombre"
                  variant="outlined"
                  margin="normal"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                  helperText={formik.touched.firstName && formik.errors.firstName}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="lastName"
                  name="lastName"
                  label="Apellido"
                  variant="outlined"
                  margin="normal"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                  helperText={formik.touched.lastName && formik.errors.lastName}
                />
              </Grid>
            </Grid>
            
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
              type="password"
              variant="outlined"
              margin="normal"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            
            <TextField
              fullWidth
              id="confirmPassword"
              name="confirmPassword"
              label="Confirmar Contraseña"
              type="password"
              variant="outlined"
              margin="normal"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
              helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
            />
            
            <FormControl 
              sx={{ mt: 2 }}
              error={formik.touched.termsAccepted && Boolean(formik.errors.termsAccepted)}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    id="termsAccepted"
                    name="termsAccepted"
                    checked={formik.values.termsAccepted}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                }
                label="Acepto los términos y condiciones"
              />
              {formik.touched.termsAccepted && formik.errors.termsAccepted && (
                <FormHelperText>{formik.errors.termsAccepted}</FormHelperText>
              )}
            </FormControl>
          </Box>
        );
        
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Detalles Académicos
            </Typography>
            
            <TextField
              fullWidth
              id="studentId"
              name="studentId"
              label="Matrícula"
              variant="outlined"
              margin="normal"
              value={formik.values.studentId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.studentId && Boolean(formik.errors.studentId)}
              helperText={formik.touched.studentId && formik.errors.studentId}
            />
            
            <TextField
              fullWidth
              id="career"
              name="career"
              select
              label="Carrera"
              variant="outlined"
              margin="normal"
              value={formik.values.career}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.career && Boolean(formik.errors.career)}
              helperText={formik.touched.career && formik.errors.career}
            >
              {careers.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            
            <TextField
              fullWidth
              id="semester"
              name="semester"
              label="Semestre"
              type="number"
              variant="outlined"
              margin="normal"
              InputProps={{ inputProps: { min: 1, max: 10 } }}
              value={formik.values.semester}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.semester && Boolean(formik.errors.semester)}
              helperText={formik.touched.semester && formik.errors.semester}
            />
          </Box>
        );
        
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Preferencias de Mentoría
            </Typography>
            
            <FormControl 
              component="fieldset" 
              margin="normal"
              error={formik.touched.role && Boolean(formik.errors.role)}
            >
              <FormLabel component="legend">¿Cómo deseas participar?</FormLabel>
              <RadioGroup
                name="role"
                value={formik.values.role}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <FormControlLabel 
                  value="MENTEE" 
                  control={<Radio />} 
                  label="Como Mentee (recibir mentoría)" 
                />
                <FormControlLabel 
                  value="MENTOR" 
                  control={<Radio />} 
                  label="Como Mentor (dar mentoría)" 
                />
              </RadioGroup>
              {formik.touched.role && formik.errors.role && (
                <FormHelperText>{formik.errors.role}</FormHelperText>
              )}
            </FormControl>
            
            {formik.values.role === 'MENTEE' && (
              <FormControl 
                fullWidth 
                margin="normal"
                error={formik.touched.interests && Boolean(formik.errors.interests)}
              >
                <FormLabel component="legend">Áreas de Interés</FormLabel>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 1 }}>
                  {topicOptions.map((topic) => (
                    <FormControlLabel
                      key={topic}
                      control={
                        <Checkbox
                          checked={formik.values.interests.includes(topic)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              formik.setFieldValue('interests', [...formik.values.interests, topic]);
                            } else {
                              formik.setFieldValue(
                                'interests',
                                formik.values.interests.filter((t) => t !== topic)
                              );
                            }
                          }}
                          onBlur={() => formik.setFieldTouched('interests', true)}
                        />
                      }
                      label={topic}
                      sx={{ width: '50%', mr: 0 }}
                    />
                  ))}
                </Box>
                {formik.touched.interests && formik.errors.interests && (
                  <FormHelperText>{formik.errors.interests}</FormHelperText>
                )}
              </FormControl>
            )}
            
            {formik.values.role === 'MENTOR' && (
              <FormControl 
                fullWidth 
                margin="normal"
                error={formik.touched.expertise && Boolean(formik.errors.expertise)}
              >
                <FormLabel component="legend">Áreas de Expertise</FormLabel>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 1 }}>
                  {topicOptions.map((topic) => (
                    <FormControlLabel
                      key={topic}
                      control={
                        <Checkbox
                          checked={formik.values.expertise.includes(topic)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              formik.setFieldValue('expertise', [...formik.values.expertise, topic]);
                            } else {
                              formik.setFieldValue(
                                'expertise',
                                formik.values.expertise.filter((t) => t !== topic)
                              );
                            }
                          }}
                          onBlur={() => formik.setFieldTouched('expertise', true)}
                        />
                      }
                      label={topic}
                      sx={{ width: '50%', mr: 0 }}
                    />
                  ))}
                </Box>
                {formik.touched.expertise && formik.errors.expertise && (
                  <FormHelperText>{formik.errors.expertise}</FormHelperText>
                )}
              </FormControl>
            )}
          </Box>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <Container maxWidth="md">
      <PageHeader 
        title="Registro" 
        subtitle="Crea una cuenta en MentorTech UTSJR" 
      />
      
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        {registerError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {registerError}
          </Alert>
        )}
        
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        <form onSubmit={formik.handleSubmit}>
          {renderStepContent(activeStep)}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              variant="outlined"
              disabled={activeStep === 0 || isSubmitting}
              onClick={handleBack}
            >
              Atrás
            </Button>
            
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={isSubmitting}
            >
              {activeStep === steps.length - 1 ? 
                (isSubmitting ? 'Registrando...' : 'Registrarme') : 
                'Siguiente'}
            </Button>
          </Box>
        </form>
        
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" style={{ color: '#0056b3' }}>
              Inicia sesión aquí
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
