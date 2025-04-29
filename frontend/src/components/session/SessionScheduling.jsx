import { useState } from 'react';
import {
  Box, Paper, Typography, Grid, Button, TextField,
  FormControl, FormControlLabel, RadioGroup, Radio,
  InputLabel, Select, MenuItem, Chip, Dialog, 
  DialogTitle, DialogContent, DialogActions, Alert,
  LinearProgress, FormHelperText, Divider, IconButton,
  List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import { 
  CalendarMonth, Schedule, LocationOn, VideoCall, 
  SportsEsports, School, Description, Close, Check
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import es from 'date-fns/locale/es';
import { addHours, format, addDays, isBefore, isAfter } from 'date-fns';
import { createSession } from '../services/api/mentorshipService';

const SessionScheduling = ({ mentorshipId, mentor, onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [topicInput, setTopicInput] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  
  const currentDate = new Date();
  const tomorrow = addDays(currentDate, 1);
  
  // Create an array of common session topics
  const commonTopics = [
    'React Hooks', 'Estado global', 'Redux', 'Async/Await',
    'Clases vs Funciones', 'Algoritmos de búsqueda', 'Estructuras de datos',
    'Patrones de diseño', 'Bases de datos', 'APIs RESTful',
    'Autenticación JWT', 'Formularios', 'Validación'
  ];
  
  const validationSchema = Yup.object({
    title: Yup.string()
      .required('El título es requerido')
      .min(5, 'El título debe tener al menos 5 caracteres')
      .max(100, 'El título no debe exceder los 100 caracteres'),
    date: Yup.date()
      .required('La fecha es requerida')
      .min(tomorrow, 'La fecha debe ser al menos mañana'),
    startTime: Yup.date()
      .required('La hora de inicio es requerida'),
    endTime: Yup.date()
      .required('La hora de finalización es requerida')
      .test('is-after-start', 'La hora de finalización debe ser después de la hora de inicio', 
        function(value) {
          const { startTime } = this.parent;
          if (!startTime || !value) return true;
          return isAfter(value, startTime);
        }
      )
      .test('max-duration', 'La sesión no puede durar más de 3 horas',
        function(value) {
          const { startTime } = this.parent;
          if (!startTime || !value) return true;
          const diff = (value - startTime) / (1000 * 60 * 60); // hours
          return diff <= 3;
        }
      ),
    mode: Yup.string()
      .required('Debes seleccionar una modalidad'),
    location: Yup.string()
      .when('mode', {
        is: 'IN_PERSON',
        then: () => Yup.string().required('La ubicación es requerida para sesiones presenciales')
      }),
    meetingLink: Yup.string()
      .when('mode', {
        is: 'VIRTUAL',
        then: () => Yup.string().required('El enlace de reunión es requerido para sesiones virtuales')
                               .url('Debe ser una URL válida')
      }),
    topics: Yup.array()
      .min(1, 'Debes seleccionar al menos un tema')
      .max(5, 'No puedes seleccionar más de 5 temas'),
    notes: Yup.string()
      .max(500, 'Las notas no deben exceder los 500 caracteres')
  });
  
  const formik = useFormik({
    initialValues: {
      title: '',
      date: addDays(new Date(), 1),
      startTime: addHours(new Date().setHours(15, 0, 0, 0), 24),
      endTime: addHours(new Date().setHours(16, 30, 0, 0), 24),
      mode: 'VIRTUAL',
      location: '',
      meetingLink: '',
      topics: [],
      notes: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      // Open confirmation dialog
      setConfirmDialogOpen(true);
    }
  });
  
  const handleConfirmSession = async () => {
    try {
      // Format the data for the API
      const sessionData = {
        mentorshipId,
        title: formik.values.title,
        date: format(formik.values.date, 'yyyy-MM-dd'),
        startTime: format(formik.values.startTime, 'HH:mm'),
        endTime: format(formik.values.endTime, 'HH:mm'),
        mode: formik.values.mode,
        location: formik.values.mode === 'VIRTUAL' 
          ? formik.values.meetingLink 
          : formik.values.location,
        topics: formik.values.topics,
        notes: formik.values.notes,
        status: 'SCHEDULED'
      };
      
      await createSession(sessionData);
      
      // Close dialogs
      setConfirmDialogOpen(false);
      setOpen(false);
      
      // Call success callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error scheduling session:', error);
      formik.setFieldError('submit', 'Error al programar la sesión. Intenta de nuevo más tarde.');
      setConfirmDialogOpen(false);
    }
  };
  
  const handleOpenDialog = () => {
    setOpen(true);
    formik.resetForm();
  };
  
  const handleCloseDialog = () => {
    if (formik.dirty) {
      if (confirm('¿Estás seguro de cerrar? Se perderán los cambios no guardados.')) {
        setOpen(false);
      }
    } else {
      setOpen(false);
    }
  };
  
  const handleAddTopic = () => {
    if (topicInput && !formik.values.topics.includes(topicInput)) {
      const newTopics = [...formik.values.topics, topicInput];
      formik.setFieldValue('topics', newTopics);
      setTopicInput('');
    }
  };
  
  const handleRemoveTopic = (topic) => {
    const newTopics = formik.values.topics.filter(t => t !== topic);
    formik.setFieldValue('topics', newTopics);
  };
  
  const handleAddCommonTopic = (topic) => {
    if (!formik.values.topics.includes(topic)) {
      const newTopics = [...formik.values.topics, topic];
      formik.setFieldValue('topics', newTopics);
    }
  };
  
  return (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={<CalendarMonth />}
        onClick={handleOpenDialog}
      >
        Programar Sesión
      </Button>
      
      <Dialog
        open={open}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Programar Nueva Sesión
        </DialogTitle>
        
        <DialogContent dividers>
          {mentor && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Programar sesión con: <strong>{mentor.name}</strong>
              </Typography>
              <Divider sx={{ my: 1 }} />
            </Box>
          )}
          
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="title"
                  name="title"
                  label="Título de la Sesión"
                  placeholder="Ej: Introducción a React Hooks"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                  <DatePicker
                    label="Fecha"
                    value={formik.values.date}
                    onChange={(newValue) => formik.setFieldValue('date', newValue)}
                    disablePast
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: formik.touched.date && Boolean(formik.errors.date),
                        helperText: formik.touched.date && formik.errors.date
                      }
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl 
                  fullWidth 
                  component="fieldset"
                  error={formik.touched.mode && Boolean(formik.errors.mode)}
                >
                  <FormLabel component="legend">Modalidad</FormLabel>
                  <RadioGroup
                    row
                    name="mode"
                    value={formik.values.mode}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
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
                  {formik.touched.mode && formik.errors.mode && (
                    <FormHelperText>{formik.errors.mode}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                  <TimePicker
                    label="Hora de inicio"
                    value={formik.values.startTime}
                    onChange={(newValue) => {
                      formik.setFieldValue('startTime', newValue);
                      
                      // Automatically set end time 1.5 hours later if not yet set
                      if (!formik.touched.endTime) {
                        formik.setFieldValue('endTime', addHours(newValue, 1.5));
                      }
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: formik.touched.startTime && Boolean(formik.errors.startTime),
                        helperText: formik.touched.startTime && formik.errors.startTime
                      }
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                  <TimePicker
                    label="Hora de finalización"
                    value={formik.values.endTime}
                    onChange={(newValue) => formik.setFieldValue('endTime', newValue)}
                    minTime={formik.values.startTime}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: formik.touched.endTime && Boolean(formik.errors.endTime),
                        helperText: formik.touched.endTime && formik.errors.endTime
                      }
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              
              {formik.values.mode === 'VIRTUAL' ? (
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
                    value={formik.values.meetingLink}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.meetingLink && Boolean(formik.errors.meetingLink)}
                    helperText={formik.touched.meetingLink && formik.errors.meetingLink}
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
                    value={formik.values.location}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.location && Boolean(formik.errors.location)}
                    helperText={formik.touched.location && formik.errors.location}
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
                      color={formik.values.topics.includes(topic) ? "primary" : "default"}
                      variant={formik.values.topics.includes(topic) ? "filled" : "outlined"}
                      sx={{ m: 0.5 }}
                    />
                  ))}
                </Box>
                
                <Typography variant="subtitle2" gutterBottom>
                  Temas seleccionados
                </Typography>
                <Box sx={{ mb: 2 }}>
                  {formik.values.topics.length > 0 ? (
                    formik.values.topics.map((topic) => (
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
                
                {formik.touched.topics && formik.errors.topics && (
                  <FormHelperText error>{formik.errors.topics}</FormHelperText>
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
                  value={formik.values.notes}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.notes && Boolean(formik.errors.notes)}
                  helperText={formik.touched.notes && formik.errors.notes}
                />
              </Grid>
              
              {formik.errors.submit && (
                <Grid item xs={12}>
                  <Alert severity="error">{formik.errors.submit}</Alert>
                </Grid>
              )}
            </Grid>
          </form>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancelar
          </Button>
          <Button 
            onClick={formik.handleSubmit}
            variant="contained" 
            color="primary"
            disabled={formik.isSubmitting || !formik.isValid}
          >
            Programar Sesión
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Confirmar Sesión
        </DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            {formik.values.title}
          </Typography>
          
          <List>
            <ListItem>
              <ListItemIcon>
                <CalendarMonth />
              </ListItemIcon>
              <ListItemText 
                primary="Fecha y Hora" 
                secondary={`${format(formik.values.date, 'EEEE, d MMMM yyyy', { locale: es })} | ${format(formik.values.startTime, 'HH:mm')} - ${format(formik.values.endTime, 'HH:mm')}`}
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                {formik.values.mode === 'VIRTUAL' ? <VideoCall /> : <LocationOn />}
              </ListItemIcon>
              <ListItemText 
                primary={formik.values.mode === 'VIRTUAL' ? 'Sesión Virtual' : 'Sesión Presencial'} 
                secondary={formik.values.mode === 'VIRTUAL' ? formik.values.meetingLink : formik.values.location}
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <School />
              </ListItemIcon>
              <ListItemText 
                primary="Temas a tratar" 
                secondary={formik.values.topics.join(', ')}
              />
            </ListItem>
            
            {formik.values.notes && (
              <ListItem>
                <ListItemIcon>
                  <Description />
                </ListItemIcon>
                <ListItemText 
                  primary="Notas adicionales" 
                  secondary={formik.values.notes}
                />
              </ListItem>
            )}
          </List>
          
          <Alert severity="info" sx={{ mt: 2 }}>
            Al confirmar, se programará la sesión y se notificará a las partes involucradas.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} color="inherit">
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirmSession}
            variant="contained" 
            color="primary"
            autoFocus
          >
            Confirmar Sesión
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SessionScheduling;
