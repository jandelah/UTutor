import { useState } from 'react';
import { 
  Container, Grid, TextField, Button, Typography, 
  Card, CardContent, CardActions, Avatar, Chip,
  InputAdornment, FormControl, InputLabel, Select, MenuItem,
  Rating, Box, Divider, Paper 
} from '@mui/material';
import { Search as SearchIcon, FilterList, School } from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    subject: '',
    availability: '',
    rating: ''
  });
  
  // Datos de ejemplo para mentores
  const mentors = [
    {
      id: 1,
      name: 'Ana García',
      avatar: 'https://i.pravatar.cc/150?img=1',
      expertise: ['Programación Web', 'JavaScript', 'React'],
      rating: 4.8,
      sessions: 24,
      availability: ['Lunes', 'Miércoles', 'Viernes'],
      bio: 'Estudiante de último semestre con experiencia en desarrollo web y aplicaciones móviles. Me apasiona enseñar y compartir conocimientos.'
    },
    {
      id: 2,
      name: 'Carlos Mendoza',
      avatar: 'https://i.pravatar.cc/150?img=2',
      expertise: ['Algoritmos', 'Estructura de Datos', 'Java'],
      rating: 4.6,
      sessions: 18,
      availability: ['Martes', 'Jueves'],
      bio: 'Entusiasta de la programación con sólidos conocimientos en algoritmos y estructuras de datos.'
    },
    {
      id: 5,
      name: 'Sofía Ramírez',
      avatar: 'https://i.pravatar.cc/150?img=5',
      expertise: ['Diseño UX/UI', 'Desarrollo móvil', 'Figma'],
      rating: 4.9,
      sessions: 32,
      availability: ['Lunes', 'Miércoles', 'Viernes'],
      bio: 'Especializada en diseño de experiencias de usuario y desarrollo móvil.'
    }
  ];
  
  // Filtrar mentores según términos de búsqueda y filtros
  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = searchTerm === '' || 
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.expertise.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSubject = filters.subject === '' || 
      mentor.expertise.some(skill => skill.toLowerCase().includes(filters.subject.toLowerCase()));
    
    const matchesAvailability = filters.availability === '' || 
      mentor.availability.includes(filters.availability);
    
    const matchesRating = filters.rating === '' || 
      mentor.rating >= parseInt(filters.rating);
    
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
  
  return (
    <Container maxWidth="lg">
      <PageHeader 
        title="Buscar Mentor" 
        subtitle="Encuentra al mentor ideal para tus necesidades académicas"
        breadcrumbs={[{ text: 'Buscar Mentor', link: '/search' }]}
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
                <MenuItem value="Lunes">Lunes</MenuItem>
                <MenuItem value="Martes">Martes</MenuItem>
                <MenuItem value="Miércoles">Miércoles</MenuItem>
                <MenuItem value="Jueves">Jueves</MenuItem>
                <MenuItem value="Viernes">Viernes</MenuItem>
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
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" component="div">
          {filteredMentors.length} mentores encontrados
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        {filteredMentors.map(mentor => (
          <Grid item xs={12} md={4} key={mentor.id}>
            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    src={mentor.avatar}
                    alt={mentor.name}
                    sx={{ width: 60, height: 60, mr: 2 }}
                  />
                  <Box>
                    <Typography variant="h6" component="div">
                      {mentor.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Rating value={mentor.rating} precision={0.1} size="small" readOnly />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        ({mentor.rating})
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {mentor.bio}
                </Typography>
                
                <Typography variant="subtitle2" gutterBottom>
                  Áreas de experiencia
                </Typography>
                <Box sx={{ mb: 2 }}>
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
                
                <Divider sx={{ my: 1.5 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <School fontSize="small" color="action" sx={{ mr: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      {mentor.sessions} sesiones
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Disponible: {mentor.availability.join(', ')}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" fullWidth>
                  Ver Perfil
                </Button>
                <Button size="small" color="secondary" variant="contained" fullWidth>
                  Solicitar Mentoría
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {filteredMentors.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <Typography variant="h6" color="text.secondary">
            No se encontraron mentores con los criterios especificados
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
    </Container>
  );
};

export default Search;