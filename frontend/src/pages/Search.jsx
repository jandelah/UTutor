import { useState, useEffect } from 'react';
import { 
  Container, Grid, TextField, Button, Typography, 
  Card, CardContent, CardActions, Avatar, Chip,
  InputAdornment, FormControl, InputLabel, Select, MenuItem,
  Rating, Box, Divider, Paper, CircularProgress, Alert, Snackbar
} from '@mui/material';
import { Search as SearchIcon, FilterList, School } from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';
import { getMentors } from '../services/api/userService';
import { createMentorship } from '../services/api/mentorshipService';
import { useAuth } from '../AuthContext';
import MentorshipRequestDialog from '../components/mentors/MentorshipRequestDialog';

const Search = () => {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    subject: '',
    availability: '',
    rating: ''
  });
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  
  useEffect(() => {
    fetchMentors();
  }, []);
  
  const fetchMentors = async () => {
    try {
      setLoading(true);
      const data = await getMentors();
      setMentors(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching mentors:", err);
      setError("Failed to load mentors. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  
  // Filtrar mentores según términos de búsqueda y filtros
  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = searchTerm === '' || 
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (mentor.expertise_areas && mentor.expertise_areas.some(skill => 
        skill.area.toLowerCase().includes(searchTerm.toLowerCase())));
    
    const matchesSubject = filters.subject === '' || 
      (mentor.expertise_areas && mentor.expertise_areas.some(skill => 
        skill.area.toLowerCase().includes(filters.subject.toLowerCase())));
    
    const matchesAvailability = filters.availability === '' || 
      (mentor.availability && mentor.availability.some(slot => 
        slot.day.toString() === filters.availability));
    
    const matchesRating = filters.rating === '' || 
      (mentor.rating && mentor.rating >= parseInt(filters.rating));
    
    return matchesSearch && matchesSubject && matchesAvailability && matchesRating;
  });
  
  // Manejar cambios en los filtros
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Open request dialog
  const handleOpenRequestDialog = (mentor) => {
    if (!currentUser) {
      setSnackbar({
        open: true,
        message: 'Por favor inicia sesión para solicitar una asesoría',
        severity: 'warning'
      });
      return;
    }
    
    setSelectedMentor(mentor);
    setRequestDialogOpen(true);
  };
  
  // Close request dialog
  const handleCloseRequestDialog = () => {
    setRequestDialogOpen(false);
  };
  
  // Handle successful request
  const handleRequestSuccess = () => {
    setSnackbar({
      open: true,
      message: '¡Solicitud de asesoría enviada con éxito!',
      severity: 'success'
    });
  };
  
  // Map day number to day name
  const getDayName = (dayNum) => {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return days[dayNum] || dayNum;
  };
  
  // Format availability for display
  const formatAvailability = (availability) => {
    if (!availability || availability.length === 0) return 'No disponible';
    
    return availability.map(slot => {
      return `${getDayName(slot.day)} (${slot.startTime}-${slot.endTime})`;
    }).join(', ');
  };
  
  // Handle snackbar close
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };
  
  if (loading) {
    return (
      <Container maxWidth="lg">
        <PageHeader 
          title="Buscar Asesor" 
          subtitle="Encuentra al asesor ideal para tus necesidades académicas"
          breadcrumbs={[{ text: 'Buscar Asesor', link: '/search' }]}
        />
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg">
      <PageHeader 
        title="Buscar Asesor" 
        subtitle="Encuentra al asesor ideal para tus necesidades académicas"
        breadcrumbs={[{ text: 'Buscar Asesor', link: '/search' }]}
      />
      
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Buscar por nombre o habilidad"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={2}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Materia</InputLabel>
              <Select
                name="subject"
                value={filters.subject}
                onChange={handleFilterChange}
                label="Materia"
              >
                <MenuItem value="">Todas</MenuItem>
                <MenuItem value="Programación">Programación</MenuItem>
                <MenuItem value="Diseño">Diseño</MenuItem>
                <MenuItem value="Algoritmos">Algoritmos</MenuItem>
                <MenuItem value="Bases de Datos">Bases de Datos</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Disponibilidad</InputLabel>
              <Select
                name="availability"
                value={filters.availability}
                onChange={handleFilterChange}
                label="Disponibilidad"
              >
                <MenuItem value="">Cualquier día</MenuItem>
                <MenuItem value="1">Lunes</MenuItem>
                <MenuItem value="2">Martes</MenuItem>
                <MenuItem value="3">Miércoles</MenuItem>
                <MenuItem value="4">Jueves</MenuItem>
                <MenuItem value="5">Viernes</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Calificación</InputLabel>
              <Select
                name="rating"
                value={filters.rating}
                onChange={handleFilterChange}
                label="Calificación"
              >
                <MenuItem value="">Cualquiera</MenuItem>
                <MenuItem value="3">3+ estrellas</MenuItem>
                <MenuItem value="4">4+ estrellas</MenuItem>
                <MenuItem value="5">5 estrellas</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
          <Button 
            variant="outlined" 
            size="small" 
            sx={{ ml: 2 }} 
            onClick={fetchMentors}
          >
            Reintentar
          </Button>
        </Alert>
      )}
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" component="div">
          {filteredMentors.length} asesores encontrados
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        {filteredMentors.map(mentor => {
          // Extract expertise areas from the mentor object
          const expertiseAreas = mentor.expertise_areas?.map(item => item.area) || [];
          
          return (
            <Grid item xs={12} md={4} key={mentor.id}>
              <Card elevation={2}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      src={mentor.avatar_url}
                      alt={mentor.name}
                      sx={{ width: 60, height: 60, mr: 2 }}
                    >
                      {mentor.name?.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" component="div">
                        {mentor.name}
                      </Typography>
                      {mentor.rating && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Rating value={mentor.rating} precision={0.1} size="small" readOnly />
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            ({mentor.rating})
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {mentor.bio || `Estudiante de ${mentor.career || 'la Universidad'}, ${mentor.semester || ''}° semestre`}
                  </Typography>
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Áreas de experiencia
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    {expertiseAreas.length > 0 ? (
                      expertiseAreas.map((skill, index) => (
                        <Chip
                          key={index}
                          label={skill}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No se especificaron áreas de expertise
                      </Typography>
                    )}
                  </Box>
                  
                  <Divider sx={{ my: 1.5 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <School fontSize="small" color="action" sx={{ mr: 0.5 }} />
                      <Typography variant="body2" color="text.secondary">
                        {mentor.completed_sessions || 0} sesiones
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {formatAvailability(mentor.availability)}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary" fullWidth>
                    Ver Perfil
                  </Button>
                  <Button 
                    size="small" 
                    color="secondary" 
                    variant="contained" 
                    fullWidth
                    onClick={() => handleOpenRequestDialog(mentor)}
                  >
                    Solicitar Asesoría
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      
      {filteredMentors.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <Typography variant="h6" color="text.secondary">
            No se encontraron asesores con los criterios especificados
          </Typography>
          <Button 
            variant="outlined" 
            color="primary" 
            sx={{ mt: 2 }}
            onClick={() => {
              setSearchTerm('');
              setFilters({ subject: '', availability: '', rating: '' });
            }}
          >
            Limpiar filtros
          </Button>
        </Box>
      )}
      
      {/* Mentorship Request Dialog */}
      {selectedMentor && (
        <MentorshipRequestDialog 
          open={requestDialogOpen}
          onClose={handleCloseRequestDialog}
          mentor={selectedMentor}
          onSuccess={handleRequestSuccess}
        />
      )}
      
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

export default Search;