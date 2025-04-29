import { useState, useEffect } from 'react';
import { 
  Container, Grid, Box, Paper, Typography, Tabs, Tab,
  Card, CardContent, CardActions, Avatar, Chip, Button,
  Divider, IconButton, Tooltip, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Rating,
  Alert, CircularProgress, Snackbar
} from '@mui/material';
import { 
  School, CalendarMonth, Chat, AccessTime, 
  Add, MoreVert, Info, Check, Close
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getMentorships, updateMentorship } from '../services/api/mentorshipService';
import { useAuth } from '../AuthContext';

const Mentorships = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [mentorships, setMentorships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMentorship, setSelectedMentorship] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  
  useEffect(() => {
    fetchMentorships();
  }, []);
  
  const fetchMentorships = async () => {
    try {
      setLoading(true);
      const response = await getMentorships();
      setMentorships(response.data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching mentorships:", err);
      setError("Error al cargar las asesorías. Inténtalo de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  };
  
  // Filtrar mentorías según el tab seleccionado
  const filteredMentorships = mentorships.filter(mentorship => {
    if (tabValue === 0) return true; // Todas
    if (tabValue === 1) return mentorship.status === 'ACTIVE'; // Activas
    if (tabValue === 2) return mentorship.status === 'COMPLETED'; // Completadas
    if (tabValue === 3) return mentorship.status === 'CANCELED'; // Canceladas
    return false;
  });
  
  // Manejar cambio de tab
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Abrir diálogo de detalles
  const handleOpenDialog = (mentorship) => {
    setSelectedMentorship(mentorship);
    setDetailsDialogOpen(true);
  };
  
  // Cerrar diálogo
  const handleCloseDialog = () => {
    setDetailsDialogOpen(false);
  };
  
  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-MX', options);
  };
  
  // End a mentorship
  const handleEndMentorship = async (mentorshipId) => {
    try {
      await updateMentorship(mentorshipId, {
        status: 'COMPLETED',
        end_date: new Date().toISOString().split('T')[0]
      });
      
      setSnackbar({
        open: true,
        message: 'Asesoría finalizada correctamente',
        severity: 'success'
      });
      
      handleCloseDialog();
      fetchMentorships();
    } catch (error) {
      console.error("Error ending mentorship:", error);
      setSnackbar({
        open: true,
        message: 'Error al finalizar la asesoría',
        severity: 'error'
      });
    }
  };
  
  // Cancel a mentorship
  const handleCancelMentorship = async (mentorshipId) => {
    try {
      await updateMentorship(mentorshipId, {
        status: 'CANCELED'
      });
      
      setSnackbar({
        open: true,
        message: 'Asesoría cancelada correctamente',
        severity: 'success'
      });
      
      handleCloseDialog();
      fetchMentorships();
    } catch (error) {
      console.error("Error canceling mentorship:", error);
      setSnackbar({
        open: true,
        message: 'Error al cancelar la asesoría',
        severity: 'error'
      });
    }
  };
  
  // Handle close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };
  
  if (loading) {
    return <LoadingSpinner message="Cargando asesorías..." />;
  }
  
  return (
    <Container maxWidth="lg">
      <PageHeader 
        title="Mis Asesorías" 
        subtitle="Gestiona tus asesorías activas y pasadas"
        breadcrumbs={[{ text: 'Mis Asesorías', link: '/tutoring' }]}
      />
      
      <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Todas" />
            <Tab label="Activas" />
            <Tab label="Completadas" />
            <Tab label="Canceladas" />
          </Tabs>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" component="div">
            {filteredMentorships.length} asesorías encontradas
          </Typography>
          {currentUser?.role === 'TUTOR' && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={() => navigate('/tutoring/create')}
            >
              Nueva Asesoría
            </Button>
          )}
        </Box>
        
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            action={
              <Button color="inherit" size="small" onClick={fetchMentorships}>
                Reintentar
              </Button>
            }
          >
            {error}
          </Alert>
        )}
        
        <Grid container spacing={3}>
          {filteredMentorships.map(mentorship => (
            <Grid item xs={12} md={6} key={mentorship.id}>
              <Card elevation={2}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        src={mentorship.tutor?.avatar_url}
                        alt={mentorship.tutor?.name}
                        sx={{ width: 50, height: 50, mr: 2 }}
                      >
                        {mentorship.tutor?.name?.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" component="div">
                          {mentorship.tutor?.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Rating value={mentorship.tutor?.rating || 0} precision={0.1} size="small" readOnly />
                        </Box>
                      </Box>
                    </Box>
                    <Chip
                      label={
                        mentorship.status === 'ACTIVE' ? 'Activa' : 
                        mentorship.status === 'COMPLETED' ? 'Completada' : 
                        mentorship.status === 'CANCELED' ? 'Cancelada' :
                        mentorship.status === 'PENDING' ? 'Pendiente' :
                        mentorship.status
                      }
                      color={
                        mentorship.status === 'ACTIVE' ? 'success' : 
                        mentorship.status === 'COMPLETED' ? 'default' : 
                        mentorship.status === 'CANCELED' ? 'error' :
                        mentorship.status === 'PENDING' ? 'warning' :
                        'default'
                      }
                      size="small"
                    />
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      <CalendarMonth fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                      Inicio: {formatDate(mentorship.start_date)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <School fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                      {mentorship.completedSessions || 0} sesiones completadas
                    </Typography>
                    {mentorship.status === 'ACTIVE' && (
                      <Typography variant="body2" color="text.secondary">
                        <AccessTime fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                        Próxima sesión: No programada
                      </Typography>
                    )}
                  </Box>
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Áreas de enfoque
                  </Typography>
                  <Box>
                    {mentorship.focus_areas?.map((area, index) => (
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
                        component={Link}
                        to={`/sessions/new?mentorshipId=${mentorship.id}`}
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
              No se encontraron asesorías
            </Typography>
            {currentUser?.role === 'TUTOR' ? (
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<Add />}
                sx={{ mt: 2 }}
                onClick={() => navigate('/tutoring/create')}
              >
                Iniciar Nueva Asesoría
              </Button>
            ) : (
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<Add />}
                sx={{ mt: 2 }}
                onClick={() => navigate('/search')}
              >
                Buscar Asesor
              </Button>
            )}
          </Box>
        )}
      </Paper>
      
      {/* Diálogo de detalles de mentoría */}
      <Dialog
        open={detailsDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedMentorship && (
          <>
            <DialogTitle>
              Detalles de Asesoría con {selectedMentorship.tutor?.name}
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Información General
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2">
                      <strong>Estado:</strong> {
                        selectedMentorship.status === 'ACTIVE' ? 'Activa' : 
                        selectedMentorship.status === 'COMPLETED' ? 'Completada' : 
                        selectedMentorship.status === 'CANCELED' ? 'Cancelada' :
                        selectedMentorship.status === 'PENDING' ? 'Pendiente' :
                        selectedMentorship.status
                      }
                    </Typography>
                    <Typography variant="body2">
                      <strong>Fecha de inicio:</strong> {formatDate(selectedMentorship.start_date)}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Sesiones completadas:</strong> {selectedMentorship.completedSessions || 0}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Sesiones programadas:</strong> {selectedMentorship.upcomingSessions || 0}
                    </Typography>
                  </Box>
                  
                  <Typography variant="subtitle1" gutterBottom>
                    Áreas de Enfoque
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    {selectedMentorship.focus_areas?.map((area, index) => (
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
                    Información del Asesor
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      src={selectedMentorship.tutor?.avatar_url}
                      alt={selectedMentorship.tutor?.name}
                      sx={{ width: 60, height: 60, mr: 2 }}
                    >
                      {selectedMentorship.tutor?.name?.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" component="div">
                        {selectedMentorship.tutor?.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Rating value={selectedMentorship.tutor?.rating || 0} precision={0.1} size="small" readOnly />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          ({selectedMentorship.tutor?.rating || 0})
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  
                  {selectedMentorship.tutorado && (
                    <>
                      <Typography variant="subtitle1" gutterBottom>
                        Información del Asesorado
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                          src={selectedMentorship.tutorado?.avatar_url}
                          alt={selectedMentorship.tutorado?.name}
                          sx={{ width: 60, height: 60, mr: 2 }}
                        >
                          {selectedMentorship.tutorado?.name?.charAt(0)}
                        </Avatar>
                        <Typography variant="h6" component="div">
                          {selectedMentorship.tutorado?.name}
                        </Typography>
                      </Box>
                    </>
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
                    placeholder="Añadir notas sobre esta asesoría..."
                    variant="outlined"
                    value={selectedMentorship.notes || ''}
                    InputProps={{
                      readOnly: true,
                    }}
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
                    component={Link}
                    to={`/sessions/new?mentorshipId=${selectedMentorship.id}`}
                  >
                    Agendar Sesión
                  </Button>
                  <Button 
                    variant="contained" 
                    color="error"
                    startIcon={<Close />}
                    onClick={() => handleCancelMentorship(selectedMentorship.id)}
                  >
                    Cancelar Asesoría
                  </Button>
                  <Button 
                    variant="contained" 
                    color="primary"
                    startIcon={<Check />}
                    onClick={() => handleEndMentorship(selectedMentorship.id)}
                  >
                    Finalizar Asesoría
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
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Mentorships;