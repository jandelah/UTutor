import { useState } from 'react';
import {
  Box, Typography, Grid, Button, TextField,
  FormControl, FormControlLabel, RadioGroup, Radio,
  InputLabel, Select, MenuItem, Chip, Dialog, 
  DialogTitle, DialogContent, DialogActions, Alert,
  LinearProgress, FormHelperText, Divider, IconButton,
  List, ListItem, ListItemIcon, ListItemText, Avatar,
  CircularProgress
} from '@mui/material';
import { 
  CalendarMonth, LocationOn, VideoCall, 
  School, Description, Close, Check,
  ArrowForward
} from '@mui/icons-material';
import { createSession } from '../../services/api/mentorshipService';

const SessionScheduling = ({ mentorship, onSuccess, onClose }) => {
  const [open, setOpen] = useState(true);
  const [topicInput, setTopicInput] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Form state
  const [formValues, setFormValues] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0], // Today in YYYY-MM-DD format
    startTime: '15:00',
    endTime: '16:30',
    mode: 'VIRTUAL',
    location: '',
    meetingLink: '',
    topics: [],
    notes: ''
  });

  // Form validation state
  const [formErrors, setFormErrors] = useState({});
  
  // Create an array of common session topics
  const commonTopics = [
    'React Hooks', 'Estado global', 'Redux', 'Async/Await',
    'Clases vs Funciones', 'Algoritmos de búsqueda', 'Estructuras de datos',
    'Patrones de diseño', 'Bases de datos', 'APIs RESTful',
    'Autenticación JWT', 'Formularios', 'Validación'
  ];
  
  const handleClose = () => {
    if (isSubmitting) return;
    setOpen(false);
    if (onClose) onClose();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };
  
  const handleAddTopic = () => {
    if (topicInput && !formValues.topics.includes(topicInput)) {
      const newTopics = [...formValues.topics, topicInput];
      setFormValues({
        ...formValues,
        topics: newTopics
      });
      setTopicInput('');
      
      // Clear error for topics
      if (formErrors.topics) {
        setFormErrors({
          ...formErrors,
          topics: null
        });
      }
    }
  };
  
  const handleRemoveTopic = (topic) => {
    const newTopics = formValues.topics.filter(t => t !== topic);
    setFormValues({
      ...formValues,
      topics: newTopics
    });
  };
  
  const handleAddCommonTopic = (topic) => {
    if (!formValues.topics.includes(topic)) {
      const newTopics = [...formValues.topics, topic];
      setFormValues({
        ...formValues,
        topics: newTopics
      });
      
      // Clear error for topics
      if (formErrors.topics) {
        setFormErrors({
          ...formErrors,
          topics: null
        });
      }
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Title validation
    if (!formValues.title) {
      errors.title = 'El título es requerido';
    } else if (formValues.title.length < 5) {
      errors.title = 'El título debe tener al menos 5 caracteres';
    }
    
    // Date validation
    if (!formValues.date) {
      errors.date = 'La fecha es requerida';
    }
    
    // Time validation
    if (!formValues.startTime) {
      errors.startTime = 'La hora de inicio es requerida';
    }
    
    if (!formValues.endTime) {
      errors.endTime = 'La hora de finalización es requerida';
    } else if (formValues.startTime >= formValues.endTime) {
      errors.endTime = 'La hora de finalización debe ser después de la hora de inicio';
    }
    
    // Location validation based on mode
    if (formValues.mode === 'VIRTUAL') {
      if (!formValues.meetingLink) {
        errors.meetingLink = 'El enlace de reunión es requerido para sesiones virtuales';
      }
    } else {
      if (!formValues.location) {
        errors.location = 'La ubicación es requerida para sesiones presenciales';
      }
    }
    
    // Topics validation
    if (formValues.topics.length === 0) {
      errors.topics = 'Debes seleccionar al menos un tema';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = () => {
    if (validateForm()) {
      setConfirmDialogOpen(true);
    }
  };
  
  const handleConfirmSession = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Format the data for the API
      const sessionData = {
        mentorship_id: mentorship.id,
        title: formValues.title,
        date: formValues.date,
        start_time: formValues.startTime,
        end_time: formValues.endTime,
        mode: formValues.mode,
        location: formValues.mode === 'VIRTUAL' 
          ? formValues.meetingLink 
          : formValues.location,
        topics: formValues.topics,
        notes: formValues.notes,
        status: 'SCHEDULED'
      };
      
      await createSession(sessionData);
      
      // Show success state
      setSuccess(true);
      setConfirmDialogOpen(false);
      
      // Close after delay
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        }
        setOpen(false);
      }, 2000);
    } catch (error) {
      console.error('Error scheduling session:', error);
      setError('Error al programar la sesión. Por favor inténtalo de nuevo.');
      setConfirmDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Programar Nueva Sesión
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        {success ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Check sx={{ fontSize: 72, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              ¡Sesión Programada!
            </Typography>
            <Typography variant="body1">
              La sesión ha sido programada exitosamente.
            </Typography>
            <LinearProgress sx={{ mt: 4 }} />
          </Box>
        ) : (
          <>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            
            {mentorship && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Información de la Asesoría
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {/* Tutor */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar 
                        src={mentorship.tutor?.avatar_url}
                        alt={mentorship.tutor?.name}
                        sx={{ width: 40, height: 40, mr: 1 }}
                      >
                        {mentorship.tutor?.name?.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Asesor
                        </Typography>
                        <Typography variant="subtitle2">
                          {mentorship.tutor?.name}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <ArrowForward sx={{ mx: 2, color: 'text.secondary' }} />
                    
                    {/* Tutorado */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar 
                        src={mentorship.tutorado?.avatar_url}
                        alt={mentorship.tutorado?.name}
                        sx={{ width: 40, height: 40, mr: 1 }}
                      >
                        {mentorship.tutorado?.name?.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Asesorado
                        </Typography>
                        <Typography variant="subtitle2">
                          {mentorship.tutorado?.name}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
                <Divider sx={{ my: 2 }} />
              </Box>
            )}
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="title"
                  name="title"
                  label="Título de la Sesión"
                  placeholder="Ej: Introducción a React Hooks"
                  value={formValues.title}
                  onChange={handleInputChange}
                  error={!!formErrors.title}
                  helperText={formErrors.title}
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="date"
                  name="date"
                  label="Fecha"
                  type="date"
                  value={formValues.date}
                  onChange={handleInputChange}
                  error={!!formErrors.date}
                  helperText={formErrors.date}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl 
                  fullWidth 
                  component="fieldset"
                  error={!!formErrors.mode}
                >
                  <Typography variant="subtitle2" gutterBottom>
                    Modalidad
                  </Typography>
                  <RadioGroup
                    row
                    name="mode"
                    value={formValues.mode}
                    onChange={handleInputChange}
                  >
                    <FormControlLabel 
                      value="VIRTUAL" 
                      control={<Radio />} 
                      label="Virtual" 
                    />
                    <FormControlLabel 
                      value="IN_PERSON" 
                      control={<Radio />} 
                      label="Presencial" 
                    />
                  </RadioGroup>
                  {formErrors.mode && (
                    <FormHelperText>{formErrors.mode}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="startTime"
                  name="startTime"
                  label="Hora de inicio"
                  type="time"
                  value={formValues.startTime}
                  onChange={handleInputChange}
                  error={!!formErrors.startTime}
                  helperText={formErrors.startTime}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="endTime"
                  name="endTime"
                  label="Hora de finalización"
                  type="time"
                  value={formValues.endTime}
                  onChange={handleInputChange}
                  error={!!formErrors.endTime}
                  helperText={formErrors.endTime}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              
              {formValues.mode === 'VIRTUAL' ? (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="meetingLink"
                    name="meetingLink"
                    label="Enlace de la reunión"
                    placeholder="Ej: https://meet.google.com/abc-defg-hij"
                    InputProps={{
                      startAdornment: (
                        <VideoCall color="primary" sx={{ mr: 1 }} />
                      )
                    }}
                    value={formValues.meetingLink}
                    onChange={handleInputChange}
                    error={!!formErrors.meetingLink}
                    helperText={formErrors.meetingLink}
                    required
                  />
                </Grid>
              ) : (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="location"
                    name="location"
                    label="Ubicación"
                    placeholder="Ej: Laboratorio B5, Edificio C"
                    InputProps={{
                      startAdornment: (
                        <LocationOn color="error" sx={{ mr: 1 }} />
                      )
                    }}
                    value={formValues.location}
                    onChange={handleInputChange}
                    error={!!formErrors.location}
                    helperText={formErrors.location}
                    required
                  />
                </Grid>
              )}
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Temas a tratar
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <TextField
                    fullWidth
                    id="topic-input"
                    label="Añadir tema"
                    value={topicInput}
                    onChange={(e) => setTopicInput(e.target.value)}
                    placeholder="Escribe y presiona Enter o Añadir"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTopic();
                      }
                    }}
                    sx={{ mb: 1 }}
                  />
                  <Button 
                    variant="outlined"
                    onClick={handleAddTopic}
                    disabled={!topicInput}
                  >
                    Añadir Tema
                  </Button>
                </Box>
                
                <Typography variant="subtitle2" gutterBottom>
                  Temas comunes
                </Typography>
                <Box sx={{ mb: 2 }}>
                  {commonTopics.map((topic) => (
                    <Chip
                      key={topic}
                      label={topic}
                      onClick={() => handleAddCommonTopic(topic)}
                      color={formValues.topics.includes(topic) ? "primary" : "default"}
                      variant={formValues.topics.includes(topic) ? "filled" : "outlined"}
                      sx={{ m: 0.5 }}
                    />
                  ))}
                </Box>
                
                <Typography variant="subtitle2" gutterBottom>
                  Temas seleccionados
                </Typography>
                <Box sx={{ mb: 2, minHeight: '50px' }}>
                  {formValues.topics.length > 0 ? (
                    formValues.topics.map((topic) => (
                      <Chip
                        key={topic}
                        label={topic}
                        onDelete={() => handleRemoveTopic(topic)}
                        color="primary"
                        sx={{ m: 0.5 }}
                      />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No has seleccionado ningún tema aún
                    </Typography>
                  )}
                </Box>
                
                {formErrors.topics && (
                  <FormHelperText error>{formErrors.topics}</FormHelperText>
                )}
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="notes"
                  name="notes"
                  label="Notas adicionales (opcional)"
                  placeholder="Cualquier información adicional o solicitudes especiales"
                  multiline
                  rows={3}
                  value={formValues.notes}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          </>
        )}
      </DialogContent>
      
      {!success && (
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit}
            variant="contained" 
            color="primary"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : <CalendarMonth />}
          >
            {isSubmitting ? 'Guardando...' : 'Programar Sesión'}
          </Button>
        </DialogActions>
      )}
      
      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => !isSubmitting && setConfirmDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Confirmar Sesión
        </DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            {formValues.title}
          </Typography>
          
          <List>
            <ListItem>
              <ListItemIcon>
                <CalendarMonth />
              </ListItemIcon>
              <ListItemText 
                primary="Fecha y Hora" 
                secondary={`${formatDate(formValues.date)} | ${formValues.startTime} - ${formValues.endTime}`}
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                {formValues.mode === 'VIRTUAL' ? <VideoCall /> : <LocationOn />}
              </ListItemIcon>
              <ListItemText 
                primary={formValues.mode === 'VIRTUAL' ? 'Sesión Virtual' : 'Sesión Presencial'} 
                secondary={formValues.mode === 'VIRTUAL' ? formValues.meetingLink : formValues.location}
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <School />
              </ListItemIcon>
              <ListItemText 
                primary="Temas a tratar" 
                secondary={formValues.topics.join(', ')}
              />
            </ListItem>
            
            {formValues.notes && (
              <ListItem>
                <ListItemIcon>
                  <Description />
                </ListItemIcon>
                <ListItemText 
                  primary="Notas adicionales" 
                  secondary={formValues.notes}
                />
              </ListItem>
            )}
          </List>
          
          <Alert severity="info" sx={{ mt: 2 }}>
            Al confirmar, se programará la sesión y se notificará a las partes involucradas.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setConfirmDialogOpen(false)} 
            color="inherit"
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirmSession}
            variant="contained" 
            color="primary"
            disabled={isSubmitting}
            startIcon={isSubmitting && <CircularProgress size={20} />}
          >
            {isSubmitting ? 'Procesando...' : 'Confirmar Sesión'}
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default SessionScheduling;