import { useState } from 'react';
import {
  Box, Button, Rating, Typography, TextField, 
  Dialog, DialogTitle, DialogContent, DialogActions,
  Alert, FormControl, InputLabel, Select, MenuItem,
  Chip, Divider, LinearProgress
} from '@mui/material';
import { 
  Star, StarOutlined, Check, SentimentVerySatisfied,
  SentimentSatisfied, SentimentDissatisfied
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../AuthContext';
import { addSessionFeedback } from '../../services/api/mentorshipService';

const SessionFeedback = ({ sessionId, sessionTitle, isCompleted, userType = 'asesorado', onFeedbackSubmitted }) => {
  const { currentUser } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const validationSchema = Yup.object({
    clarity: Yup.number()
      .required('Este campo es requerido')
      .min(1, 'Debe seleccionar una calificación'),
    usefulness: Yup.number()
      .required('Este campo es requerido')
      .min(1, 'Debe seleccionar una calificación'),
    engagement: userType === 'asesor' ? Yup.number()
      .required('Este campo es requerido')
      .min(1, 'Debe seleccionar una calificación') : Yup.number(),
    pace: userType === 'asesorado' ? Yup.number()
      .required('Este campo es requerido')
      .min(1, 'Debe seleccionar una calificación') : Yup.number(),
    learningAreas: Yup.array().when('userType', {
      is: 'asesorado',
      then: () => Yup.array().min(1, 'Seleccione al menos un área')
    }),
    comments: Yup.string()
      .max(500, 'Los comentarios no deben exceder los 500 caracteres')
  });
  
  const formik = useFormik({
    initialValues: {
      clarity: 0,
      usefulness: 0,
      engagement: userType === 'asesor' ? 0 : undefined,
      pace: userType === 'asesorado' ? 0 : undefined,
      learningAreas: [],
      comments: '',
      userType: userType
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        // Format the feedback object
        const feedback = {
          clarity: values.clarity,
          usefulness: values.usefulness,
          comments: values.comments
        };
        
        // Add additional fields based on user type
        if (userType === 'asesor') {
          feedback.engagement = values.engagement;
        } else {
          feedback.pace = values.pace;
          feedback.learningAreas = values.learningAreas;
        }
        
        // Submit the feedback
        const result = await addSessionFeedback(sessionId, userType, feedback);
        
        setSuccess(true);
        
        // Notify parent component
        if (onFeedbackSubmitted) {
          onFeedbackSubmitted(result);
        }
        
        // Close dialog after delay
        setTimeout(() => {
          setDialogOpen(false);
          setSuccess(false);
          resetForm();
        }, 2000);
      } catch (error) {
        console.error('Error submitting feedback:', error);
        setErrors({ submit: 'Error al enviar la retroalimentación. Intente nuevamente.' });
      } finally {
        setSubmitting(false);
      }
    },
  });
  
  const handleOpenDialog = () => {
    setDialogOpen(true);
    formik.resetForm();
    setSuccess(false);
  };
  
  const handleCloseDialog = () => {
    if (formik.dirty && !success) {
      if (confirm('¿Estás seguro de cerrar? Se perderán los datos no guardados.')) {
        setDialogOpen(false);
      }
    } else {
      setDialogOpen(false);
    }
  };
  
  const handleAddLearningArea = (area) => {
    const currentAreas = [...formik.values.learningAreas];
    
    if (currentAreas.includes(area)) {
      formik.setFieldValue(
        'learningAreas',
        currentAreas.filter(a => a !== area)
      );
    } else {
      formik.setFieldValue('learningAreas', [...currentAreas, area]);
    }
  };
  
  // Common learning areas for selection
  const learningAreas = [
    'Conceptos básicos', 'Aplicación práctica', 'Solución de problemas',
    'Código limpio', 'Algoritmos', 'Arquitectura', 'Patrones de diseño',
    'Optimización', 'Debugging', 'Testing', 'Documentación'
  ];
  
  // Function to get icon based on rating value
  const getRatingIcon = (value) => {
    if (value >= 4) return <SentimentVerySatisfied color="success" />;
    if (value >= 3) return <SentimentSatisfied color="primary" />;
    return <SentimentDissatisfied color="error" />;
  };
  
  // Helper function to get label text for ratings
  const getRatingLabelText = (value) => {
    const labels = ['Muy malo', 'Malo', 'Regular', 'Bueno', 'Excelente'];
    return labels[value - 1] || '';
  };
  
  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        startIcon={<Star />}
        onClick={handleOpenDialog}
        disabled={!isCompleted}
      >
        {userType === 'asesor' ? 'Evaluar al Asesorado' : 'Evaluar la Asesoría'}
      </Button>
      
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {userType === 'asesor' ? 'Evaluar al Asesorado' : 'Evaluar la Asesoría'}
        </DialogTitle>
        
        <DialogContent dividers>
          {success ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Check sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                ¡Gracias por tu retroalimentación!
              </Typography>
              <Typography variant="body1">
                Tu evaluación ayudará a mejorar futuras sesiones.
              </Typography>
              <LinearProgress sx={{ mt: 4 }} />
            </Box>
          ) : (
            <form onSubmit={formik.handleSubmit}>
              <Typography variant="subtitle1" gutterBottom>
                {sessionTitle ? `Sesión: ${sessionTitle}` : 'Evaluación de la sesión'}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Claridad de la explicación
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Rating
                    name="clarity"
                    value={formik.values.clarity}
                    onChange={(event, newValue) => {
                      formik.setFieldValue('clarity', newValue);
                    }}
                    precision={1}
                    size="large"
                    emptyIcon={<StarOutlined style={{ opacity: 0.55 }} fontSize="inherit" />}
                  />
                  <Box sx={{ ml: 2, minWidth: 100 }}>
                    {formik.values.clarity > 0 && (
                      <>
                        {getRatingIcon(formik.values.clarity)}
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {getRatingLabelText(formik.values.clarity)}
                        </Typography>
                      </>
                    )}
                  </Box>
                </Box>
                {formik.touched.clarity && formik.errors.clarity && (
                  <Typography color="error" variant="body2">
                    {formik.errors.clarity}
                  </Typography>
                )}
              </Box>
              
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Utilidad del contenido
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Rating
                    name="usefulness"
                    value={formik.values.usefulness}
                    onChange={(event, newValue) => {
                      formik.setFieldValue('usefulness', newValue);
                    }}
                    precision={1}
                    size="large"
                    emptyIcon={<StarOutlined style={{ opacity: 0.55 }} fontSize="inherit" />}
                  />
                  <Box sx={{ ml: 2, minWidth: 100 }}>
                    {formik.values.usefulness > 0 && (
                      <>
                        {getRatingIcon(formik.values.usefulness)}
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {getRatingLabelText(formik.values.usefulness)}
                        </Typography>
                      </>
                    )}
                  </Box>
                </Box>
                {formik.touched.usefulness && formik.errors.usefulness && (
                  <Typography color="error" variant="body2">
                    {formik.errors.usefulness}
                  </Typography>
                )}
              </Box>
              
              {userType === 'asesor' ? (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Nivel de participación del asesorado
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating
                      name="engagement"
                      value={formik.values.engagement}
                      onChange={(event, newValue) => {
                        formik.setFieldValue('engagement', newValue);
                      }}
                      precision={1}
                      size="large"
                      emptyIcon={<StarOutlined style={{ opacity: 0.55 }} fontSize="inherit" />}
                    />
                    <Box sx={{ ml: 2, minWidth: 100 }}>
                      {formik.values.engagement > 0 && (
                        <>
                          {getRatingIcon(formik.values.engagement)}
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            {getRatingLabelText(formik.values.engagement)}
                          </Typography>
                        </>
                      )}
                    </Box>
                  </Box>
                  {formik.touched.engagement && formik.errors.engagement && (
                    <Typography color="error" variant="body2">
                      {formik.errors.engagement}
                    </Typography>
                  )}
                </Box>
              ) : (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Ritmo de la sesión
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating
                      name="pace"
                      value={formik.values.pace}
                      onChange={(event, newValue) => {
                        formik.setFieldValue('pace', newValue);
                      }}
                      precision={1}
                      size="large"
                      emptyIcon={<StarOutlined style={{ opacity: 0.55 }} fontSize="inherit" />}
                    />
                    <Box sx={{ ml: 2, minWidth: 100 }}>
                      {formik.values.pace > 0 && (
                        <>
                          {getRatingIcon(formik.values.pace)}
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            {getRatingLabelText(formik.values.pace)}
                          </Typography>
                        </>
                      )}
                    </Box>
                  </Box>
                  {formik.touched.pace && formik.errors.pace && (
                    <Typography color="error" variant="body2">
                      {formik.errors.pace}
                    </Typography>
                  )}
                </Box>
              )}
              
              {userType === 'asesorado' && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Áreas de aprendizaje fortalecidas
                  </Typography>
                  <Box sx={{ mb: 1 }}>
                    {learningAreas.map((area) => (
                      <Chip
                        key={area}
                        label={area}
                        onClick={() => handleAddLearningArea(area)}
                        color={formik.values.learningAreas.includes(area) ? "primary" : "default"}
                        sx={{ m: 0.5 }}
                      />
                    ))}
                  </Box>
                  {formik.touched.learningAreas && formik.errors.learningAreas && (
                    <Typography color="error" variant="body2">
                      {formik.errors.learningAreas}
                    </Typography>
                  )}
                </Box>
              )}
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Comentarios adicionales
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  name="comments"
                  value={formik.values.comments}
                  onChange={formik.handleChange}
                  placeholder="Comparte tu experiencia, aspectos a mejorar o lo que te gustó de la sesión"
                />
              </Box>
              
              {formik.errors.submit && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {formik.errors.submit}
                </Alert>
              )}
            </form>
          )}
        </DialogContent>
        
        {!success && (
          <DialogActions>
            <Button onClick={handleCloseDialog} color="inherit">
              Cancelar
            </Button>
            <Button 
              onClick={formik.handleSubmit} 
              variant="contained" 
              color="primary"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? 'Enviando...' : 'Enviar Evaluación'}
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </>
  );
};

export default SessionFeedback;