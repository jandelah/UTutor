import { useEffect, useState } from 'react';
import { 
  Container, Box, Tab, Tabs, Button, Paper, Alert,
  CircularProgress
} from '@mui/material';
import { 
  Person, CalendarMonth, MenuBook, Assessment, 
  Folder, History 
} from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ProfileHeader from '../components/profile/ProfileHeader';
import MentorInfo from '../components/profile/MentorInfo';
import MenteeInfo from '../components/profile/MenteeInfo';
import { getUserById, getMentorProfileByUserId, getMenteeProfileByUserId } from '../services/api/userService';
import { useAuth } from '../AuthContext';

const Profile = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [user, setUser] = useState(null);
  const [mentorProfile, setMentorProfile] = useState(null);
  const [menteeProfile, setMenteeProfile] = useState(null);
  
  useEffect(() => {
    if (currentUser) {
      fetchUserData(currentUser.id);
    } else {
      setLoading(false);
      setError("User not authenticated");
    }
  }, [currentUser]);
  
  const fetchUserData = async (userId) => {
    try {
      setLoading(true);
      setError(null);
      
      // Load the user data from context or fetch it
      setUser(currentUser || await getUserById(userId));
      
      // Try to load mentor profile if user is a tutor
      if (currentUser?.role === 'TUTOR') {
        try {
          const mentorData = await getMentorProfileByUserId(userId);
          setMentorProfile(mentorData);
        } catch (err) {
          console.log('No mentor profile found or error loading it', err);
          // No need to set a global error, this is an expected case for new users
        }
      }
      
      // Try to load mentee profile if user is a tutorado
      if (currentUser?.role === 'TUTORADO') {
        try {
          const menteeData = await getMenteeProfileByUserId(userId);
          setMenteeProfile(menteeData);
        } catch (err) {
          console.log('No mentee profile found or error loading it', err);
          // No need to set a global error, this is an expected case for new users
        }
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError("Failed to load profile data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleRetry = () => {
    if (currentUser) {
      fetchUserData(currentUser.id);
    }
  };
  
  if (loading) {
    return <LoadingSpinner message="Cargando perfil..." />;
  }
  
  if (error) {
    return (
      <Container maxWidth="lg">
        <PageHeader 
          title="Mi Perfil" 
          subtitle="Gestiona tu información y preferencias de asesoría"
          breadcrumbs={[{ text: 'Mi Perfil', link: '/profile' }]}
        />
        <Alert 
          severity="error" 
          sx={{ mt: 3 }}
          action={
            <Button color="inherit" size="small" onClick={handleRetry}>
              Reintentar
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }
  
  if (!user) {
    return (
      <Container maxWidth="lg">
        <PageHeader 
          title="Mi Perfil" 
          subtitle="Gestiona tu información y preferencias de asesoría"
          breadcrumbs={[{ text: 'Mi Perfil', link: '/profile' }]}
        />
        <Alert severity="info">
          Por favor inicia sesión para ver tu perfil
        </Alert>
      </Container>
    );
  }
  
  const isAsesor = user.role === 'TUTOR';
  
  return (
    <Container maxWidth="lg">
      <PageHeader 
        title="Mi Perfil" 
        subtitle="Gestiona tu información y preferencias de asesoría"
        breadcrumbs={[{ text: 'Mi Perfil', link: '/profile' }]}
      />
      
      <ProfileHeader 
        user={user} 
        profile={isAsesor ? mentorProfile : menteeProfile} 
        isMentor={isAsesor} 
        isOwnProfile={true} 
      />
      
      <Paper elevation={2} sx={{ borderRadius: 2, mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<Person />} iconPosition="start" label="Información" />
          <Tab icon={<CalendarMonth />} iconPosition="start" label="Sesiones" />
          <Tab icon={<MenuBook />} iconPosition="start" label="Recursos" />
          <Tab icon={<Assessment />} iconPosition="start" label="Estadísticas" />
          <Tab icon={<Folder />} iconPosition="start" label="Documentos" />
          <Tab icon={<History />} iconPosition="start" label="Historial" />
        </Tabs>
        
        <Box sx={{ p: 3 }}>
          {tabValue === 0 && (
            isAsesor && mentorProfile ? (
              <MentorInfo profile={mentorProfile} />
            ) : menteeProfile ? (
              <MenteeInfo profile={menteeProfile} />
            ) : (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Alert severity="info" sx={{ mb: 3 }}>
                  No se encontró un perfil completo. Por favor completa tu información de perfil.
                </Alert>
                <Button variant="contained" color="primary">
                  Crear Perfil de {isAsesor ? 'Asesor' : 'Asesorado'}
                </Button>
              </Box>
            )
          )}
          
          {tabValue === 1 && (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <Alert severity="info">
                Contenido de Sesiones (por implementar)
              </Alert>
            </Box>
          )}
          
          {tabValue === 2 && (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <Alert severity="info">
                Contenido de Recursos (por implementar)
              </Alert>
            </Box>
          )}
          
          {tabValue === 3 && (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <Alert severity="info">
                Contenido de Estadísticas (por implementar)
              </Alert>
            </Box>
          )}
          
          {tabValue === 4 && (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <Alert severity="info">
                Contenido de Documentos (por implementar)
              </Alert>
            </Box>
          )}
          
          {tabValue === 5 && (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <Alert severity="info">
                Contenido de Historial (por implementar)
              </Alert>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile;