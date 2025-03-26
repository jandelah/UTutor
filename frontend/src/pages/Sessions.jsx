import { useState, useEffect } from 'react';
import { 
  Container, Grid, Box, Paper, Typography, Tab, Tabs, 
  Card, CardContent, CardActions, Button, Chip, 
  Divider, IconButton, TextField, InputAdornment,
  Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { 
  CalendarMonth, AccessTime, VideoCall, LocationOn, 
  Search, FilterList, Edit, Delete, OpenInNew, Check,
  Event, FilterAlt, Sort, ClearAll
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getUpcomingSessions, getCompletedSessions } from '../services/api/mentorshipService';

const Sessions = () => {
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSession, setSelectedSession] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    mode: '',
    dateRange: '',
    topic: ''
  });

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        // Get both upcoming and completed sessions
        const [upcomingSessions, completedSessions] = await Promise.all([
          getUpcomingSessions(),
          getCompletedSessions()
        ]);

        // Combine and sort by date (most recent first for completed, soonest first for upcoming)
        const allSessions = [
          ...upcomingSessions.map(session => ({ ...session, type: 'upcoming' })),
          ...completedSessions.map(session => ({ ...session, type: 'completed' }))
        ];
        
        setSessions(allSessions);
        filterSessions(allSessions, tabValue, searchTerm, filters);
      } catch (error) {
        console.error('Error fetching sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const filterSessions = (sessionsToFilter, tab, search, filterOptions) => {
    let filtered = [...sessionsToFilter];

    // Filter by tab
    if (tab === 1) {
      filtered = filtered.filter(session => session.type === 'upcoming');
    } else if (tab === 2) {
      filtered = filtered.filter(session => session.type === 'completed');
    } else if (tab === 3) {
      filtered = filtered.filter(session => session.status === 'CANCELED');
    }

    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        session => 
          session.title.toLowerCase().includes(searchLower) ||
          (session.topics && session.topics.some(topic => topic.toLowerCase().includes(searchLower)))
      );
    }

    // Apply additional filters
    if (filterOptions.mode) {
      filtered = filtered.filter(session => session.mode === filterOptions.mode);
    }

    if (filterOptions.topic) {
      filtered = filtered.filter(session => 
        session.topics && session.topics.includes(filterOptions.topic)
      );
    }

    // Date range filtering would require more complex logic with actual dates
    // This is a simplified version
    if (filterOptions.dateRange === 'thisWeek') {
      // Implementation would check if session date is within current week
      // For mock purposes, we'll just use a subset
      filtered = filtered.slice(0, Math.max(Math.floor(filtered.length / 2), 1));
    } else if (filterOptions.dateRange === 'nextWeek') {
      // Implementation would check if session date is within next week
      // For mock purposes, we'll just use a different subset
      filtered = filtered.slice(Math.floor(filtered.length / 2));
    }

    setFilteredSessions(filtered);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    filterSessions(sessions, newValue, searchTerm, filters);
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    filterSessions(sessions, tabValue, value, filters);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    filterSessions(sessions, tabValue, searchTerm, newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      mode: '',
      dateRange: '',
      topic: ''
    };
    setFilters(emptyFilters);
    setSearchTerm('');
    filterSessions(sessions, tabValue, '', emptyFilters);
    setFilterDialogOpen(false);
  };

  const applyFilters = () => {
    filterSessions(sessions, tabValue, searchTerm, filters);
    setFilterDialogOpen(false);
  };

  const openSessionDetails = (session) => {
    setSelectedSession(session);
    setDetailsDialogOpen(true);
  };

  const closeSessionDetails = () => {
    setDetailsDialogOpen(false);
  };

  // Format date to a more readable format
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-MX', options);
  };

  // All possible session topics from the mock data
  const availableTopics = [
    'useState', 'useEffect', 'Custom Hooks', 'Context API', 'useContext', 
    'Estado global', 'Condicionales', 'Bucles', 'Switch', 'Arrays', 
    'ArrayList', 'HashMaps'
  ];

  if (loading) {
    return <LoadingSpinner message="Cargando sesiones..." />;
  }

  return (
    <Container maxWidth="lg">
      <PageHeader 
        title="Sesiones de Mentoría" 
        subtitle="Administra tus sesiones de mentoría pasadas y futuras"
        breadcrumbs={[{ text: 'Sesiones', link: '/sessions' }]}
      />

      <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <TextField
            placeholder="Buscar por título o tema..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ width: { xs: '100%', sm: '50%', md: '40%' } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <Box>
            <Button 
              variant="outlined"
              startIcon={<FilterAlt />}
              onClick={() => setFilterDialogOpen(true)}
              sx={{ mr: 1 }}
            >
              Filtros
            </Button>
            <Button 
              variant="contained" 
              color="primary"
              startIcon={<CalendarMonth />}
              component={Link}
              to="/sessions/new"
            >
              Nueva Sesión
            </Button>
          </Box>
        </Box>

        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
        >
          <Tab label="Todas" />
          <Tab label="Próximas" />
          <Tab label="Completadas" />
          <Tab label="Canceladas" />
        </Tabs>

        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          {filteredSessions.length} {filteredSessions.length === 1 ? 'sesión encontrada' : 'sesiones encontradas'}
        </Typography>

        {filteredSessions.length === 0 ? (
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              justifyContent: 'center',
              py: 6
            }}
          >
            <Event sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No hay sesiones disponibles
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              {searchTerm || (filters.mode || filters.dateRange || filters.topic) 
                ? 'Prueba con otros filtros de búsqueda'
                : tabValue === 1 
                  ? 'No tienes sesiones próximas programadas' 
                  : tabValue === 2
                    ? 'No tienes sesiones completadas'
                    : tabValue === 3
                      ? 'No tienes sesiones canceladas'
                      : 'No tienes sesiones registradas'}
            </Typography>
            {(searchTerm || filters.mode || filters.dateRange || filters.topic) && (
              <Button 
                variant="outlined" 
                startIcon={<ClearAll />}
                onClick={clearFilters}
              >
                Limpiar filtros
              </Button>
            )}
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredSessions.map((session) => (
              <Grid item xs={12} sm={6} md={4} key={session.id}>
                <Card 
                  elevation={2} 
                  sx={{ 
                    borderLeft: 4,
                    borderColor: session.type === 'upcoming' 
                      ? 'primary.main' 
                      : session.status === 'CANCELED' 
                        ? 'error.main' 
                        : 'success.main',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="div" gutterBottom>
                      {session.title}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CalendarMonth fontSize="small" color="action" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(session.date)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <AccessTime fontSize="small" color="action" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {session.startTime} - {session.endTime}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {session.mode === 'VIRTUAL' ? (
                        <VideoCall fontSize="small" color="primary" sx={{ mr: 1 }} />
                      ) : (
                        <LocationOn fontSize="small" color="error" sx={{ mr: 1 }} />
                      )}
                      <Typography variant="body2" color="text.secondary">
                        {session.location}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      {session.topics && session.topics.map((topic, index) => (
                        <Chip
                          key={index}
                          label={topic}
                          size="small"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                    </Box>
                    
                    <Chip 
                      label={
                        session.status === 'SCHEDULED' 
                          ? 'Programada' 
                          : session.status === 'COMPLETED' 
                            ? 'Completada' 
                            : 'Cancelada'
                      }
                      color={
                        session.status === 'SCHEDULED' 
                          ? 'primary' 
                          : session.status === 'COMPLETED' 
                            ? 'success' 
                            : 'error'
                      }
                      size="small"
                    />
                  </CardContent>
                  
                  <Divider />
                  
                  <CardActions>
                    <Button 
                      size="small" 
                      startIcon={<OpenInNew />}
                      onClick={() => openSessionDetails(session)}
                    >
                      Detalles
                    </Button>
                    
                    {session.status === 'SCHEDULED' && (
                      <>
                        <Button 
                          size="small" 
                          color="secondary"
                          startIcon={<Edit />}
                        >
                          Editar
                        </Button>
                        <Button 
                          size="small" 
                          color="error"
                          startIcon={<Delete />}
                        >
                          Cancelar
                        </Button>
                      </>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      {/* Session Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={closeSessionDetails}
        maxWidth="md"
        fullWidth
      >
        {selectedSession && (
          <>
            <DialogTitle>
              Detalles de la Sesión
            </DialogTitle>
            <DialogContent dividers>
              <Typography variant="h5" component="div" gutterBottom>
                {selectedSession.title}
              </Typography>
              
              <Grid container spacing={3} sx={{ mb: 2 }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Información General
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CalendarMonth color="action" sx={{ mr: 1 }} />
                      <Typography variant="body1">
                        {formatDate(selectedSession.date)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <AccessTime color="action" sx={{ mr: 1 }} />
                      <Typography variant="body1">
                        {selectedSession.startTime} - {selectedSession.endTime}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      {selectedSession.mode === 'VIRTUAL' ? (
                        <VideoCall color="primary" sx={{ mr: 1 }} />
                      ) : (
                        <LocationOn color="error" sx={{ mr: 1 }} />
                      )}
                      <Typography variant="body1">
                        {selectedSession.location}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Typography variant="subtitle1" gutterBottom>
                    Estado
                  </Typography>
                  <Chip 
                    label={
                      selectedSession.status === 'SCHEDULED' 
                        ? 'Programada' 
                        : selectedSession.status === 'COMPLETED' 
                          ? 'Completada' 
                          : 'Cancelada'
                    }
                    color={
                      selectedSession.status === 'SCHEDULED' 
                        ? 'primary' 
                        : selectedSession.status === 'COMPLETED' 
                          ? 'success' 
                          : 'error'
                    }
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Temas a tratar
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    {selectedSession.topics?.map((topic, index) => (
                      <Chip
                        key={index}
                        label={topic}
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                  </Box>
                  
                  {selectedSession.resources?.length > 0 && (
                    <>
                      <Typography variant="subtitle1" gutterBottom>
                        Recursos
                      </Typography>
                      <Box component="ul" sx={{ pl: 2 }}>
                        {selectedSession.resources.map((resource, index) => (
                          <Typography component="li" key={index} variant="body2">
                            <Link href={resource.url} target="_blank" rel="noopener">
                              {resource.title} ({resource.type})
                            </Link>
                          </Typography>
                        ))}
                      </Box>
                    </>
                  )}
                </Grid>
              </Grid>
              
              {selectedSession.notes && (
                <>
                  <Typography variant="subtitle1" gutterBottom>
                    Notas
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {selectedSession.notes}
                  </Typography>
                </>
              )}
              
              {selectedSession.feedback && (
                <>
                  <Typography variant="subtitle1" gutterBottom>
                    Retroalimentación
                  </Typography>
                  <Grid container spacing={2}>
                    {selectedSession.feedback.mentor && (
                      <Grid item xs={12} sm={6}>
                        <Paper variant="outlined" sx={{ p: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Feedback del Mentor
                          </Typography>
                          <Typography variant="body2" paragraph>
                            {selectedSession.feedback.mentor.comments}
                          </Typography>
                        </Paper>
                      </Grid>
                    )}
                    
                    {selectedSession.feedback.mentee && (
                      <Grid item xs={12} sm={6}>
                        <Paper variant="outlined" sx={{ p: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Feedback del Mentee
                          </Typography>
                          <Typography variant="body2" paragraph>
                            {selectedSession.feedback.mentee.comments}
                          </Typography>
                        </Paper>
                      </Grid>
                    )}
                  </Grid>
                </>
              )}
            </DialogContent>
            <DialogActions>
              {selectedSession.status === 'SCHEDULED' && (
                <>
                  <Button 
                    color="error"
                    startIcon={<Delete />}
                  >
                    Cancelar Sesión
                  </Button>
                  <Button 
                    color="secondary"
                    startIcon={<Edit />}
                  >
                    Editar Sesión
                  </Button>
                </>
              )}
              <Button 
                onClick={closeSessionDetails} 
                color="primary"
                startIcon={<Check />}
              >
                Cerrar
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Filters Dialog */}
      <Dialog
        open={filterDialogOpen}
        onClose={() => setFilterDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          Filtros
        </DialogTitle>
        <DialogContent dividers>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Modalidad</InputLabel>
            <Select
              name="mode"
              value={filters.mode}
              onChange={handleFilterChange}
              label="Modalidad"
            >
              <MenuItem value="">Todas</MenuItem>
              <MenuItem value="VIRTUAL">Virtual</MenuItem>
              <MenuItem value="IN_PERSON">Presencial</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Rango de Fechas</InputLabel>
            <Select
              name="dateRange"
              value={filters.dateRange}
              onChange={handleFilterChange}
              label="Rango de Fechas"
            >
              <MenuItem value="">Cualquier fecha</MenuItem>
              <MenuItem value="thisWeek">Esta semana</MenuItem>
              <MenuItem value="nextWeek">Próxima semana</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Tema</InputLabel>
            <Select
              name="topic"
              value={filters.topic}
              onChange={handleFilterChange}
              label="Tema"
            >
              <MenuItem value="">Todos los temas</MenuItem>
              {availableTopics.map((topic) => (
                <MenuItem key={topic} value={topic}>{topic}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={clearFilters} 
            color="inherit"
            startIcon={<ClearAll />}
          >
            Limpiar
          </Button>
          <Button 
            onClick={applyFilters} 
            color="primary"
            variant="contained"
            startIcon={<Check />}
          >
            Aplicar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Sessions;