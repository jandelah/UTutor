import { useState, useEffect } from 'react';
import { 
  Container, Paper, Typography, TextField, Button, Box, 
  Autocomplete, Chip, FormControl, InputLabel, Select, MenuItem,
  Grid, Alert, CircularProgress, Divider, Avatar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import { getMenteesWithProfiles } from '../services/api/userService';
import { createMentorship } from '../services/api/mentorshipService';
import { useAuth } from '../AuthContext';

const CreateMentorship = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [mentees, setMentees] = useState([]);
  const [loadingMentees, setLoadingMentees] = useState(true);
  const [selectedMentee, setSelectedMentee] = useState(null);
  const [focusAreas, setFocusAreas] = useState([]);
  const [focusInput, setFocusInput] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('ACTIVE'); // or "PENDING"
  
  // Common focus areas suggestions
  const commonFocusAreas = [
    'Programación Web', 'Desarrollo Backend', 'Bases de Datos',
    'Algoritmos', 'Estructura de Datos', 'React', 'JavaScript',
    'Node.js', 'Python', 'Java', 'Diseño UX/UI', 'HTML/CSS'
  ];
  
  useEffect(() => {
    // Check if user is a tutor
    if (currentUser && currentUser.role !== 'TUTOR') {
      navigate('/tutoring');
    }
    fetchMentees();
  }, [currentUser, navigate]);
  
  const fetchMentees = async () => {
    try {
      setLoadingMentees(true);
      // Fetch mentees (usually this would filter to only show users with role="TUTORADO")
      const data = await getMenteesWithProfiles();
      setMentees(data || []);
    } catch (err) {
      console.error("Error fetching mentees:", err);
      setError("Error al cargar los tutorados. Inténtalo de nuevo más tarde.");
    } finally {
      setLoadingMentees(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedMentee) {
      setError("Por favor, selecciona un tutorado");
      return;
    }
    
    if (focusAreas.length === 0) {
      setError("Por favor, añade al menos un área de enfoque");
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const mentorshipData = {
        tutor_id: currentUser.id,
        tutorado_id: selectedMentee.id,
        start_date: new Date().toISOString().split('T')[0],
        status: status,
        focus_areas: focusAreas,
        notes: notes || ''
      };
      
      await createMentorship(mentorshipData);
      navigate('/tutoring', { 
        state: { 
          success: true, 
          message: 'Mentoría creada correctamente'
        }
      });
    } catch (err) {
      console.error("Error creating mentorship:", err);
      setError("Error al crear la mentoría. Inténtalo de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddFocusArea = () => {
    if (focusInput && !focusAreas.includes(focusInput)) {
      setFocusAreas([...focusAreas, focusInput]);
      setFocusInput('');
    }
  };
  
  const handleRemoveFocusArea = (area) => {
    setFocusAreas(focusAreas.filter(a => a !== area));
  };
  
  return (
    <Container maxWidth="md">
      <PageHeader 
        title="Crear Nueva Mentoría" 
        subtitle="Inicia una nueva relación de mentoría con un estudiante"
        breadcrumbs={[
          { text: 'Mis Mentorías', link: '/tutoring' },
          { text: 'Crear Nueva', link: '/tutoring/create' }
        ]}
      />
      
      <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Seleccionar Tutorado
              </Typography>
              
              <Autocomplete
                fullWidth
                options={mentees}
                loading={loadingMentees}
                getOptionLabel={(option) => option.name || ''}
                renderOption={(props, option) => (
                  <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                    <Avatar 
                      src={option.avatar_url}
                      alt={option.name}
                      sx={{ width: 30, height: 30, mr: 2 }}
                    >
                      {option.name?.charAt(0)}
                    </Avatar>
                    <Box>
                      {option.name}
                      <Typography variant="body2" color="text.secondary">
                        {option.email} • {option.career}, {option.semester}° semestre
                      </Typography>
                    </Box>
                  </Box>
                )}
                value={selectedMentee}
                onChange={(event, newValue) => {
                  setSelectedMentee(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Buscar tutorado por nombre"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingMentees ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Selecciona un estudiante de la lista o configura una mentoría abierta
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="h6" gutterBottom>
                Áreas de Enfoque
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Áreas de enfoque comunes:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                  {commonFocusAreas.map((area) => (
                    <Chip
                      key={area}
                      label={area}
                      onClick={() => {
                        if (!focusAreas.includes(area)) {
                          setFocusAreas([...focusAreas, area]);
                        }
                      }}
                      color={focusAreas.includes(area) ? "primary" : "default"}
                      variant={focusAreas.includes(area) ? "filled" : "outlined"}
                    />
                  ))}
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TextField
                  fullWidth
                  label="Añadir área de enfoque personalizada"
                  value={focusInput}
                  onChange={(e) => setFocusInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddFocusArea();
                    }
                  }}
                  sx={{ mr: 1 }}
                />
                <Button 
                  variant="outlined"
                  onClick={handleAddFocusArea}
                  disabled={!focusInput}
                >
                  Añadir
                </Button>
              </Box>
              
              <Typography variant="subtitle2" gutterBottom>
                Áreas seleccionadas:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, minHeight: 40 }}>
                {focusAreas.length > 0 ? (
                  focusAreas.map((area) => (
                    <Chip
                      key={area}
                      label={area}
                      onDelete={() => handleRemoveFocusArea(area)}
                      color="primary"
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No hay áreas seleccionadas
                  </Typography>
                )}
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="h6" gutterBottom>
                Detalles Adicionales
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Estado Inicial</InputLabel>
                <Select
                  value={status}
                  label="Estado Inicial"
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <MenuItem value="ACTIVE">Activa (comienza inmediatamente)</MenuItem>
                  <MenuItem value="PENDING">Pendiente (requiere confirmación)</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                fullWidth
                label="Notas de la mentoría"
                multiline
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe los objetivos, expectativas o cualquier información relevante para la mentoría..."
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/tutoring')}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading || focusAreas.length === 0}
                >
                  {loading ? (
                    <>
                      <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                      Creando...
                    </>
                  ) : (
                    'Crear Mentoría'
                  )}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateMentorship;