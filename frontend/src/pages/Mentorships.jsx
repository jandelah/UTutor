import { useState } from 'react';
import { 
  Container, Grid, Typography, Paper, Box, Tabs, Tab,
  Card, CardContent, CardActions, Avatar, Chip, Button,
  Divider, IconButton, Tooltip, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Rating
} from '@mui/material';
import { 
  School, CalendarMonth, Chat, AccessTime, 
  Add, MoreVert, Info, Check, Close
} from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';

const Mentorships = () => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedMentorship, setSelectedMentorship] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Datos de ejemplo para mentorías
  const mentorships = [
    {
      id: 1,
      mentor: {
        id: 1,
        name: 'Ana García',
        avatar: 'https://i.pravatar.cc/150?img=1',
        rating: 4.8
      },
      startDate: '2023-09-01',
      status: 'ACTIVE',
      focusAreas: ['Programación Web', 'React', 'Frontend'],
      nextSession: '2023-10-15T15:00:00',
      completedSessions: 3,
      upcomingSessions: 2
    },
    {
      id: 2,
      mentor: {
        id: 2,
        name: 'Carlos Mendoza',
        avatar: 'https://i.pravatar.cc/150?img=2',
        rating: 4.6
      },
      startDate: '2023-08-15',
      status: 'ACTIVE',
      focusAreas: ['Algoritmos', 'Estructura de Datos', 'Java'],
      nextSession: '2023-10-18T14:00:00',
      completedSessions: 4,
      upcomingSessions: 1
    },
    {
      id: 3,
      mentor: {
        id: 5,
        name: 'Sofía Ramírez',
        avatar: 'https://i.pravatar.cc/150?img=5',
        rating: 4.9
      },
      startDate: '2023-05-10',
      status: 'COMPLETED',
      focusAreas: ['Diseño UX/UI', 'Wireframing', 'User Research'],
      nextSession: null,
      completedSessions: 8,
      upcomingSessions: 0
    }
  ];
  
  // Filtrar mentorías según el tab seleccionado
  const filteredMentorships = mentorships.filter(mentorship => {
    if (tabValue === 0) return true; // Todas
    if (tabValue === 1) return mentorship.status === 'ACTIVE'; // Activas
    if (tabValue === 2) return mentorship.status === 'COMPLETED'; // Completadas
    return false;
  });
  
  // Manejar cambio de tab
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Abrir diálogo de detalles
  const handleOpenDialog = (mentorship) => {
    setSelectedMentorship(mentorship);
    setDialogOpen(true);
  };
  
  // Cerrar diálogo
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };
  
  // Formatear fecha
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-MX', options);
  };
  
  // Formatear fecha y hora para próxima sesión
  const formatNextSession = (dateTimeString) => {
    if (!dateTimeString) return 'No hay sesiones programadas';
    
    const options = { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateTimeString).toLocaleDateString('es-MX', options);
  };
  
  return (
    <Container maxWidth="lg">
      <PageHeader 
        title="Mis Mentorías" 
        subtitle="Gestiona tus mentorías activas y pasadas"
        breadcrumbs={[{ text: 'Mis Mentorías', link: '/mentorships' }]}
      />
      
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Todas" />
            <Tab label="Activas" />
            <Tab label="Completadas" />
          </Tabs>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" component="div">
            {filteredMentorships.length} mentorías encontradas
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => {}}
          >
            Nueva Mentoría
          </Button>
        </Box>
        
        <Grid container spacing={3}>
          {filteredMentorships.map(mentorship => (
            <Grid item xs={12} md={6} key={mentorship.id}>
              <Card elevation={2}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        src={mentorship.mentor.avatar}
                        alt={mentorship.mentor.name}
                        sx={{ width: 50, height: 50, mr: 2 }}
                      />
                      <Box>
                        <Typography variant="h6" component="div">
                          {mentorship.mentor.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Rating value={mentorship.mentor.rating} precision={0.1} size="small" readOnly />
                        </Box>
                      </Box>
                    </Box>
                    <Chip
                      label={mentorship.status === 'ACTIVE' ? 'Activa' : 'Completada'}
                      color={mentorship.status === 'ACTIVE' ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      <CalendarMonth fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                      Inicio: {formatDate(mentorship.startDate)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <School fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                      {mentorship.completedSessions} sesiones completadas
                    </Typography>
                    {mentorship.status === 'ACTIVE' && (
                      <Typography variant="body2" color="text.secondary">
                        <AccessTime fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                        Próxima sesión: {formatNextSession(mentorship.nextSession)}
                      </Typography>
                    )}
                  </Box>
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Áreas de enfoque
                  </Typography>
                  <Box>
                    {mentorship.focusAreas.map((area, index) => (
                      <Chip
                        key={index}
                        label={area}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                  </Box>
                </CardContent>
                
                <Divider />
                
                <CardActions>
                  <Button 
                    size="small" 
                    color="primary"
                    startIcon={<Info />}
                    onClick={() => handleOpenDialog(mentorship)}
                  >
                    Detalles
                  </Button>
                  
                  {mentorship.status === 'ACTIVE' && (
                    <>
                      <Button 
                        size="small" 
                        color="secondary"
                        startIcon={<CalendarMonth />}
                      >
                        Agendar
                      </Button>
                      <Button 
                        size="small" 
                        startIcon={<Chat />}
                      >
                        Mensaje
                      </Button>
                    </>
                  )}
                  
                  <Box sx={{ ml: 'auto' }}>
                    <IconButton size="small">
                      <MoreVert fontSize="small" />
                    </IconButton>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        {filteredMentorships.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <Typography variant="h6" color="text.secondary">
              No se encontraron mentorías
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<Add />}
              sx={{ mt: 2 }}
              onClick={() => {}}
            >
              Iniciar Nueva Mentoría
            </Button>
          </Box>
        )}
      </Paper>
      
      {/* Diálogo de detalles de mentoría */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedMentorship && (
          <>
            <DialogTitle>
              Detalles de Mentoría con {selectedMentorship.mentor.name}
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Información General
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2">
                      <strong>Estado:</strong> {selectedMentorship.status === 'ACTIVE' ? 'Activa' : 'Completada'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Fecha de inicio:</strong> {formatDate(selectedMentorship.startDate)}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Sesiones completadas:</strong> {selectedMentorship.completedSessions}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Sesiones programadas:</strong> {selectedMentorship.upcomingSessions}
                    </Typography>
                  </Box>
                  
                  <Typography variant="subtitle1" gutterBottom>
                    Áreas de Enfoque
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    {selectedMentorship.focusAreas.map((area, index) => (
                      <Chip
                        key={index}
                        label={area}
                        size="small"
                        color="primary"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Información del Mentor
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      src={selectedMentorship.mentor.avatar}
                      alt={selectedMentorship.mentor.name}
                      sx={{ width: 60, height: 60, mr: 2 }}
                    />
                    <Box>
                      <Typography variant="h6" component="div">
                        {selectedMentorship.mentor.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Rating value={selectedMentorship.mentor.rating} precision={0.1} size="small" readOnly />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          ({selectedMentorship.mentor.rating})
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  
                  {selectedMentorship.status === 'ACTIVE' && selectedMentorship.nextSession && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Próxima Sesión
                      </Typography>
                      <Typography variant="body2">
                        {formatNextSession(selectedMentorship.nextSession)}
                      </Typography>
                      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                        <Button 
                          variant="outlined" 
                          size="small"
                          startIcon={<CalendarMonth />}
                        >
                          Reprogramar
                        </Button>
                        <Button 
                          variant="outlined" 
                          color="error" 
                          size="small"
                          startIcon={<Close />}
                        >
                          Cancelar
                        </Button>
                      </Box>
                    </Box>
                  )}
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" gutterBottom>
                    Notas y Retroalimentación
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Añadir notas sobre esta mentoría..."
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              {selectedMentorship.status === 'ACTIVE' ? (
                <>
                  <Button 
                    onClick={handleCloseDialog} 
                    color="inherit"
                  >
                    Cerrar
                  </Button>
                  <Button 
                    variant="contained" 
                    color="secondary"
                    startIcon={<CalendarMonth />}
                  >
                    Agendar Sesión
                  </Button>
                  <Button 
                    variant="contained" 
                    color="error"
                  >
                    Finalizar Mentoría
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={handleCloseDialog} 
                  color="primary"
                  startIcon={<Check />}
                >
                  Cerrar
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default Mentorships;