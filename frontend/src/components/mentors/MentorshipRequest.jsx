import { useState } from 'react';
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Chip, Typography, FormControl, Alert, Stepper,
  Step, StepLabel, FormHelperText, Grid, MenuItem, Select, InputLabel,
  CircularProgress, Paper
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { School, Check, Send } from '@mui/icons-material';
import { createMentorship } from '../../services/api/mentorshipService';
import { useAuth } from '../../AuthContext';

const MentorshipRequest = ({ mentor, onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [topicInput, setTopicInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const { currentUser } = useAuth();
  
  const steps = ['Detalles de la asesoría', 'Objetivos y expectativas', 'Revisión y envío'];
  
  // Areas of expertise to select from (would come from mentor profile in a real app)
  const expertiseAreas = mentor?.expertise || [
    'Programación Web', 'JavaScript', 'React', 'Node.js', 
    'Bases de Datos', 'Algoritmos', 'Estructura de Datos'
  ];

  // Validation schemas for each step
  const validationSchemas = [
    // Step 1: Tutoring Details
    Yup.object({
      focusAreas: Yup.array()
        .min(1, 'Selecciona al menos un área de enfoque')
        .max(5, 'No puedes seleccionar más de 5 áreas de enfoque')
        .required('Debes seleccionar al menos un área de enfoque'),
      schedule: Yup.string()
        .required('Por favor indica tu disponibilidad')
    }),
    
    // Step 2: Goals and Expectations
    Yup.object({
      goals: Yup.string()
        .required('Por favor describe tus objetivos')
        .min(20, 'Por favor proporciona más detalles sobre tus objetivos'),
      experience: Yup.string()
        .required('Por favor describe tu nivel de experiencia')
    }),
    
    // Step 3: No validation needed, just confirmation
    Yup.object({})
  ];
  
  const formik = useFormik({
    initialValues: {
      focusAreas: [],
      schedule: '',
      goals: '',
      experience: '',
      additionalNotes: ''
    },
    validationSchema: validationSchemas[activeStep],
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      if (activeStep < steps.length - 1) {
        handleNext();
      } else {
        await submitRequest(values);
      }
    }
  });
  
  const handleOpen = () => {
    setOpen(true);
    setActiveStep(0);
    setSuccess(false);
    formik.resetForm();
  };
  
  const handleClose = () => {
    if (submitting) return;
    
    if (formik.dirty && !success) {
      if (confirm('¿Estás seguro de cerrar? Los cambios no se guardarán.')) {
        setOpen(false);
      }
    } else {
      setOpen(false);
    }
  };
  
  const handleNext = () => {
    const schema = validationSchemas[activeStep];
    
    try {
      schema.validateSync(formik.values, { abortEarly: false });
      setActiveStep(activeStep + 1);
      // Set the validation schema for the next step
      formik.setValidationSchema(validationSchemas[activeStep + 1]);
    } catch (err) {
      // Make sure errors are shown to user
      const touchedFields = {};
      err.inner.forEach(({ path }) => {
        touchedFields[path] = true;
      });
      formik.setTouched({ ...formik.touched, ...touchedFields });
    }
  };
  
  const handleBack = () => {
    setActiveStep(activeStep - 1);
    // Set the validation schema for the previous step
    formik.setValidationSchema(validationSchemas[activeStep - 1]);
  };
  
  const handleToggleFocusArea = (area) => {
    const currentAreas = [...formik.values.focusAreas];
    const areaIndex = currentAreas.indexOf(area);
    
    if (areaIndex === -1) {
      // Add the area if not already selected
      if (currentAreas.length < 5) {
        currentAreas.push(area);
      }
    } else {
      // Remove the area if already selected
      currentAreas.splice(areaIndex, 1);
    }
    
    formik.setFieldValue('focusAreas', currentAreas);
  };
  
  const submitRequest = async (values) => {
    setSubmitting(true);
    
    try {
      // In a real app, we'd use the actual user ID and mentor ID
      const mentorshipData = {
        tutorId: mentor?.id || 1,
        tutoradoId: currentUser?.id || 3,
        status: 'PENDING',
        startDate: new Date().toISOString().split('T')[0],
        endDate: null,
        focusAreas: values.focusAreas,
        notes: `Objetivos: ${values.goals}\n\nExperiencia previa: ${values.experience}\n\nDisponibilidad: ${values.schedule}\n\nNotas adicionales: ${values.additionalNotes || 'Ninguna'}`,
        tutorRating: null,
        tutoradoRating: null
      };
      
      await createMentorship(mentorshipData);
      
      setSuccess(true);
      
      // Call the onSuccess callback after a delay
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        }
        setOpen(false);
      }, 2000);
    } catch (error) {
      console.error('Error creating mentorship:', error);
      formik.setFieldError('submit', 'Error al crear la asesoría. Intenta nuevamente más tarde.');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Render the current step content
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Áreas de enfoque
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Selecciona las áreas en las que deseas recibir asesoría (máximo 5):
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              {expertiseAreas.map((area) => (
                <Chip
                  key={area}
                  label={area}
                  onClick={() => handleToggleFocusArea(area)}
                  color={formik.values.focusAreas.includes(area) ? "primary" : "default"}
                  variant={formik.values.focusAreas.includes(area) ? "filled" : "outlined"}
                  sx={{ m: 0.5 }}
                />
              ))}
              
              {formik.touched.focusAreas && formik.errors.focusAreas && (
                <FormHelperText error sx={{ mt: 1 }}>
                  {formik.errors.focusAreas}
                </FormHelperText>
              )}
            </Box>
            
            <Typography variant="h6" gutterBottom>
              Disponibilidad
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Describe tu disponibilidad para las sesiones (días y horarios):
            </Typography>
            
            <TextField
              fullWidth
              multiline
              rows={3}
              name="schedule"
              id="schedule"
              placeholder="Ej: Lunes y miércoles de 3 a 5 PM, viernes por la mañana..."
              value={formik.values.schedule}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.schedule && Boolean(formik.errors.schedule)}
              helperText={formik.touched.schedule && formik.errors.schedule}
            />
          </Box>
        );
        
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Objetivos de aprendizaje
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Describe brevemente qué esperas lograr con esta asesoría:
            </Typography>
            
            <TextField
              fullWidth
              multiline
              rows={4}
              name="goals"
              id="goals"
              placeholder="Ej: Quiero aprender React desde cero, entender los hooks básicos y poder crear una aplicación simple..."
              value={formik.values.goals}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.goals && Boolean(formik.errors.goals)}
              helperText={formik.touched.goals && formik.errors.goals}
              sx={{ mb: 3 }}
            />
            
            <Typography variant="h6" gutterBottom>
              Experiencia previa
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Describe tu nivel actual de conocimiento en el área:
            </Typography>
            
            <TextField
              fullWidth
              multiline
              rows={3}
              name="experience"
              id="experience"
              placeholder="Ej: Tengo conocimientos básicos de HTML y CSS, pero nunca he usado JavaScript ni React..."
              value={formik.values.experience}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.experience && Boolean(formik.errors.experience)}
              helperText={formik.touched.experience && formik.errors.experience}
            />
          </Box>
        );
        
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Resumen de la solicitud
            </Typography>
            
            <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Áreas de enfoque:
              </Typography>
              <Box sx={{ mb: 2 }}>
                {formik.values.focusAreas.map((area) => (
                  <Chip key={area} label={area} color="primary" sx={{ m: 0.5 }} />
                ))}
              </Box>
              
              <Typography variant="subtitle1" gutterBottom>
                Disponibilidad:
              </Typography>
              <Typography variant="body2" paragraph>
                {formik.values.schedule}
              </Typography>
              
              <Typography variant="subtitle1" gutterBottom>
                Objetivos de aprendizaje:
              </Typography>
              <Typography variant="body2" paragraph>
                {formik.values.goals}
              </Typography>
              
              <Typography variant="subtitle1" gutterBottom>
                Experiencia previa:
              </Typography>
              <Typography variant="body2" paragraph>
                {formik.values.experience}
              </Typography>
            </Paper>
            
            <Typography variant="h6" gutterBottom>
              Notas adicionales (opcional)
            </Typography>
            
            <TextField
              fullWidth
              multiline
              rows={3}
              name="additionalNotes"
              id="additionalNotes"
              placeholder="Cualquier información adicional que quieras compartir con el asesor..."
              value={formik.values.additionalNotes}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            
            {formik.errors.submit && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {formik.errors.submit}
              </Alert>
            )}
          </Box>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={<School />}
        onClick={handleOpen}
        fullWidth
      >
        Solicitar Asesoría
      </Button>
      
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {success ? 'Solicitud Enviada' : `Solicitar Asesoría con ${mentor?.name || 'Asesor'}`}
        </DialogTitle>
        
        <DialogContent dividers>
          {success ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Check sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                ¡Solicitud enviada exitosamente!
              </Typography>
              <Typography variant="body1">
                Tu solicitud ha sido enviada. El asesor revisará tu solicitud y te contactará pronto.
              </Typography>
            </Box>
          ) : (
            <>
              <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              
              <form onSubmit={formik.handleSubmit}>
                {getStepContent(activeStep)}
              </form>
            </>
          )}
        </DialogContent>
        
        {!success && (
          <DialogActions>
            <Button 
              onClick={handleClose} 
              color="inherit"
              disabled={submitting}
            >
              Cancelar
            </Button>
            {activeStep > 0 && (
              <Button 
                onClick={handleBack}
                disabled={submitting}
              >
                Atrás
              </Button>
            )}
            <Button
              variant="contained"
              color="primary"
              onClick={formik.handleSubmit}
              disabled={submitting}
              endIcon={activeStep === steps.length - 1 ? 
                (submitting ? <CircularProgress size={20} /> : <Send />) : 
                null}
            >
              {activeStep === steps.length - 1 ? 
                (submitting ? 'Enviando...' : 'Enviar Solicitud') : 
                'Siguiente'}
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </>
  );
};

export default MentorshipRequest;