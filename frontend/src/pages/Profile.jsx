import { useEffect, useState } from 'react';
import { Container, Box, Tab, Tabs, Button, Paper } from '@mui/material';
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

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [user, setUser] = useState(null);
  const [mentorProfile, setMentorProfile] = useState(null);
  const [menteeProfile, setMenteeProfile] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // En una implementación real, obtendríamos el ID del usuario actual
        // desde un contexto de autenticación
        const userId = 1; // ID de ejemplo
        
        // Obtener datos del usuario
        const userData = await getUserById(userId);
        setUser(userData);
        
        // Intentar obtener perfiles de mentor y mentee
        try {
          const mentorData = await getMentorProfileByUserId(userId);
          setMentorProfile(mentorData);
        } catch (error) {
          console.log('No mentor profile found');
        }
        
        try {
          const menteeData = await getMenteeProfileByUserId(userId);
          setMenteeProfile(menteeData);
        } catch (error) {
          console.log('No mentee profile found');
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  if (loading) {
    return <LoadingSpinner message="Cargando perfil..." />;
  }
  
  const isMentor = user.role === 'MENTOR';
  
  return (
    <Container maxWidth="lg">
      <PageHeader 
        title="Mi Perfil" 
        subtitle="Gestiona tu información y preferencias de mentoría"
        breadcrumbs={[{ text: 'Mi Perfil', link: '/profile' }]}
      />
      
      <ProfileHeader 
        user={user} 
        profile={isMentor ? mentorProfile : menteeProfile} 
        isMentor={isMentor} 
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
            isMentor && mentorProfile ? (
              <MentorInfo profile={mentorProfile} />
            ) : menteeProfile ? (
              <MenteeInfo profile={menteeProfile} />
            ) : (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Button variant="contained" color="primary">
                  Crear Perfil de {isMentor ? 'Mentor' : 'Mentee'}
                </Button>
              </Box>
            )
          )}
          
          {tabValue === 1 && (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              Contenido de Sesiones (por implementar)
            </Box>
          )}
          
          {tabValue === 2 && (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              Contenido de Recursos (por implementar)
            </Box>
          )}
          
          {tabValue === 3 && (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              Contenido de Estadísticas (por implementar)
            </Box>
          )}
          
          {tabValue === 4 && (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              Contenido de Documentos (por implementar)
            </Box>
          )}
          
          {tabValue === 5 && (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              Contenido de Historial (por implementar)
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile;