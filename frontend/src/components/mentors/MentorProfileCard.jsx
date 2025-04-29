import { useState } from 'react';
import { 
  Card, CardContent, CardActions, Avatar, Typography, Box, 
  Chip, Rating, Button, Divider, Grid, Paper, Dialog,
  DialogTitle, DialogContent, DialogActions, Tabs, Tab, List,
  ListItem, ListItemIcon, ListItemText, useTheme
} from '@mui/material';
import { 
  School, Schedule, Chat, CalendarMonth, Star, LocationOn,
  CheckCircle, Info, PersonOutline, Assignment, BookOutlined,
  AccessTime, VideoCall
} from '@mui/icons-material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { createMentorship } from '../../services/api/mentorshipService';
import { useAuth } from '../../AuthContext';
import SessionScheduling from '../sessions/SessionScheduling';

const MentorProfileCard = ({ mentor, onRequestSuccess }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [requestError, setRequestError] = useState(null);
  const [selectedAreas, setSelectedAreas] = useState([]);
  
  // Format the availability days for better readability
  const formatAvailability = (days) => {
    if (!days || days.length === 0) return 'No disponible';
    
    const weekDays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return days.map(day => {
      if (typeof day === 'object' && day.day !== undefined) {
        return `${weekDays[day.day]} (${day.startTime}-${day.endTime})`;
      }
      return weekDays[day] || day;
    }).join(', ');
  };
  
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleOpenRequestDialog = () => {
    setRequestDialogOpen(true);
    setSelectedAreas([]);
    setRequestError(null);
    setRequestSuccess(false);
  };
  
  const handleCloseRequestDialog = () => {
    setRequestDialogOpen(false);
  };
  
  const handleAreaToggle = (area) => {
    if (selectedAreas.includes(area)) {
      setSelectedAreas(selectedAreas.filter(a => a !== area));
    } else {
      setSelectedAreas([...selectedAreas, area]);
    }
  };
  
  const handleSubmitRequest = async () => {
    if (selectedAreas.length === 0) {
      setRequestError('Por favor selecciona al menos un área de enfoque');
      return;
    }
    
    setRequesting(true);
    setRequestError(null);
    
    try {
      // Create mentorship data
      const mentorshipData = {
        tutorId: mentor.id,
        tutoradoId: currentUser?.id || 3, // Default to a tutorado ID if user not available
        focusAreas: selectedAreas,
        notes: `Solicitud de asesoría enviada desde la página de búsqueda el ${format(new Date(), 'PP', { locale: es })}`
      };
      
      // Create the mentorship
      await createMentorship(mentorshipData);
      
      // Show success and close after delay
      setRequestSuccess(true);
      
      setTimeout(() => {
        setRequestDialogOpen(false);
        
        // Call the success callback if provided
        if (onRequestSuccess) {
          onRequestSuccess(mentor.id);
        }
      }, 2000);
    } catch (error) {
      console.error('Error submitting mentorship request:', error);
      setRequestError('Error al enviar la solicitud. Inténtalo de nuevo más tarde.');
    } finally {
      setRequesting(false);
    }
  };
  
  return (
    <>
      <Card 
        elevation={expanded ? 3 : 2} 
        sx={{ 
          height: expanded ? 'auto' : '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.3s ease',
          ':hover': {
            boxShadow: 6
          }
        }}
      >
        <CardContent sx={{ flexGrow: 1, pt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                src={mentor.avatar}
                alt={mentor.name}
                sx={{ width: 70, height: 70, mr: 2, border: '2px solid', borderColor: 'primary.main' }}
              />
              <Box>
                <Typography variant="h5" component="div" gutterBottom={false}>
                  {mentor.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Rating value={mentor.rating} precision={0.1} size="small" readOnly />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    ({mentor.rating.toFixed(1)})
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Chip
              label={mentor.status === 'ACTIVE' ? 'Activo' : 'Completado'}
              color={mentor.status === 'ACTIVE' ? 'success' : 'default'}
              size="small"
            />
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" sx={{ fontStyle: 'italic', color: 'text.secondary', mb: 2 }}>
              "{mentor.bio || 'Estudiante avanzado con pasión por compartir conocimientos y ayudar a otros estudiantes.'}"
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <School fontSize="small" color="primary" sx={{ mr: 1 }} />
              <Typography variant="body2">
                {mentor.sessions} sesiones completadas
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Schedule fontSize="small" color="action" sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Disponible: {formatAvailability(mentor.availability)}
              </Typography>
            </Box>
          </Box>
          
          <Typography variant="subtitle1" gutterBottom>
            Áreas de expertise
          </Typography>
          <Box>
            {mentor.expertise.map((skill, index) => (
              <Chip
                key={index}
                label={skill}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ mr: 0.5, mb: 0.5 }}
              />
            ))}
          </Box>
          
          {expanded && (
            <>
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 1 }}>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  variant="fullWidth"
                  sx={{ mb: 2 }}
                >
                  <Tab icon={<Info />} label="Perfil" />
                  <Tab icon={<Assignment />} label="Experiencia" />
                  <Tab icon={<School />} label="Materias" />
                </Tabs>
                
                {tabValue === 0 && (
                  <Box sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Información del Perfil
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <List dense disablePadding>
                        <ListItem disableGutters>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <PersonOutline fontSize="small" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Carrera" 
                            secondary={mentor.career || "Desarrollo de Software"} 
                          />
                        </ListItem>
                        <ListItem disableGutters>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <BookOutlined fontSize="small" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Semestre" 
                            secondary={mentor.semester || "8° semestre"} 
                          />
                        </ListItem>
                        <ListItem disableGutters>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <AccessTime fontSize="small" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Tiempo como asesor" 
                            secondary={mentor.experience || "2 semestres"} 
                          />
                        </ListItem>
                        <ListItem disableGutters>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <VideoCall fontSize="small" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Modalidades" 
                            secondary={mentor.modes || "Virtual y Presencial"} 
                          />
                        </ListItem>
                      </List>
                    </Box>
                  </Box>
                )}
                
                {tabValue === 1 && (
                  <Box sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Experiencia
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {mentor.experience || 
                        'Cuenta con experiencia en desarrollo de proyectos profesionales y ha participado en varias hackathons. Ha sido asistente de profesor en cursos de programación y ha ayudado a varios compañeros a mejorar sus habilidades técnicas.'}
                    </Typography>
                    
                    <Typography variant="subtitle2" gutterBottom>
                      Logros destacados
                    </Typography>
                    <List dense disablePadding>
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckCircle fontSize="small" color="success" />
                        </ListItemIcon>
                        <ListItemText primary="Certificación en desarrollo web frontend" />
                      </ListItem>
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckCircle fontSize="small" color="success" />
                        </ListItemIcon>
                        <ListItemText primary="Participación en proyecto de vinculación empresarial" />
                      </ListItem>
                    </List>
                  </Box>
                )}
                
                {tabValue === 2 && (
                  <Box sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Materias Destacadas
                    </Typography>
                    {mentor.topSubjects ? (
                      <List dense disablePadding>
                        {mentor.topSubjects.map((subject, index) => (
                          <ListItem key={index} disableGutters>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              <Star fontSize="small" color={subject.grade >= 90 ? "warning" : "action"} />
                            </ListItemIcon>
                            <ListItemText 
                              primary={subject.name} 
                              secondary={`Calificación: ${subject.grade}`}
                            />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Información de materias no disponible
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
            </>
          )}
        </CardContent>
        
        <Divider />
        
        <CardActions sx={{ p: 2, justifyContent: 'space-between' }}>
          <Button 
            size="small" 
            color={expanded ? "inherit" : "primary"}
            onClick={handleExpandClick}
          >
            {expanded ? 'Mostrar menos' : 'Ver más detalles'}
          </Button>
          
          <Box>
            <Button 
              size="small" 
              color="info"
              startIcon={<Chat />}
              sx={{ mr: 1 }}
            >
              Mensaje
            </Button>
            <Button 
              size="small" 
              color="primary"
              variant="contained"
              startIcon={<School />}
              onClick={handleOpenRequestDialog}
            >
              Solicitar Asesoría
            </Button>
          </Box>
        </CardActions>
      </Card>
      
      {/* Request Dialog */}
      <Dialog
        open={requestDialogOpen}
        onClose={handleCloseRequestDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Solicitar Asesoría a {mentor.name}
        </DialogTitle>
        <DialogContent dividers>
          {requestSuccess ? (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <CheckCircle sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                ¡Solicitud Enviada!
              </Typography>
              <Typography variant="body1">
                Tu solicitud ha sido enviada exitosamente. {mentor.name} recibirá una notificación y podrá aceptar tu solicitud pronto.
              </Typography>
            </Box>
          ) : (
            <>
              <Typography variant="body1" paragraph>
                Estás a punto de solicitar una asesoría con {mentor.name}. Por favor selecciona las áreas en las que te gustaría recibir apoyo:
              </Typography>
              
              <Typography variant="subtitle1" gutterBottom>
                Áreas de expertise disponibles
              </Typography>
              <Box sx={{ mb: 3 }}>
                {mentor.expertise.map((area, index) => (
                  <Chip
                    key={index}
                    label={area}
                    onClick={() => handleAreaToggle(area)}
                    color={selectedAreas.includes(area) ? "primary" : "default"}
                    variant={selectedAreas.includes(area) ? "filled" : "outlined"}
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Box>
              
              {requestError && (
                <Paper 
                  elevation={0} 
                  sx={{ 
                    bgcolor: 'error.light', 
                    color: 'error.contrastText',
                    p: 2,
                    mt: 2,
                    mb: 2,
                    borderRadius: 1
                  }}
                >
                  <Typography variant="body2">{requestError}</Typography>
                </Paper>
              )}
              
              <Typography variant="body2" color="text.secondary">
                Después de enviar tu solicitud, {mentor.name} recibirá una notificación y podrá aceptarla o rechazarla.
                Una vez aceptada, podrás programar sesiones de asesoría según la disponibilidad de ambos.
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          {!requestSuccess && (
            <>
              <Button onClick={handleCloseRequestDialog} color="inherit">
                Cancelar
              </Button>
              <Button 
                onClick={handleSubmitRequest}
                variant="contained" 
                color="primary"
                disabled={requesting}
              >
                {requesting ? 'Enviando...' : 'Enviar Solicitud'}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MentorProfileCard;