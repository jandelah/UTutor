import { useEffect, useState } from 'react';
import { Container, Grid, Typography, Box, Paper } from '@mui/material';
import { 
  Group, School, CalendarMonth, MenuBook,
  TrendingUp, Assessment, History
} from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StatCard from '../components/dashboard/StatCard';
import SessionsChart from '../components/dashboard/SessionsChart';
import TopMentorsList from '../components/dashboard/TopMentorsList';
import SubjectDistribution from '../components/dashboard/SubjectDistribution';
import UpcomingSessions from '../components/dashboard/UpcomingSessions';
import { getDashboardStats } from '../services/api/dashboardService';
import { getUpcomingSessions } from '../services/api/mentorshipService';
import { useAuth } from '../AuthContext.jsx';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeTutorias: 0,
    completedSessions: 0,
    upcomingSessions: 0,
    averageTutorRating: 0,
    tutoriasBySubject: [],
    monthlySessionsData: [],
    topTutores: [],
    recentResources: []
  });
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener datos del dashboard y sesiones próximas en paralelo
        const [statsData, sessionsData] = await Promise.all([
          getDashboardStats(),
          getUpcomingSessions()
        ]);
        
        // Ensure stats data has default values for all properties
        setStats({
          activeTutorias: statsData?.activeTutorias ?? 0,
          completedSessions: statsData?.completedSessions ?? 0,
          upcomingSessions: statsData?.upcomingSessions ?? 0,
          averageTutorRating: statsData?.averageTutorRating ?? 0,
          tutoriasBySubject: statsData?.tutoriasBySubject ?? [],
          monthlySessionsData: statsData?.monthlySessionsData ?? [],
          topTutores: statsData?.topTutores ?? [],
          recentResources: statsData?.recentResources ?? []
        });
        
        setUpcomingSessions(Array.isArray(sessionsData) ? sessionsData : []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Hubo un error al cargar los datos del dashboard. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (loading) {
    return <LoadingSpinner message="Cargando dashboard..." />;
  }
  
  if (error) {
    return (
      <Container maxWidth="lg">
        <PageHeader 
          title={`Bienvenido, ${currentUser?.name?.split(' ')[0] || 'Usuario'}`}
          subtitle="Visualiza el progreso y estado de tus asesorías"
        />
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg">
      <PageHeader 
        title={`Bienvenido, ${currentUser?.name?.split(' ')[0] || 'Usuario'}`}
        subtitle="Visualiza el progreso y estado de tus asesorías"
      />
      
      <Grid container spacing={3}>
        {/* Tarjetas de estadísticas */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Asesorías Activas" 
            value={stats.activeTutorias}
            icon={<Group />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Sesiones Completadas" 
            value={stats.completedSessions} 
            icon={<School />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Próximas Sesiones" 
            value={stats.upcomingSessions}
            icon={<CalendarMonth />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Calificación Promedio" 
            value={typeof stats.averageTutorRating === 'number' ? stats.averageTutorRating.toFixed(1) : '0.0'} 
            icon={<Assessment />}
            color="info"
          />
        </Grid>
        
        {/* Gráfica de sesiones mensuales */}
        <Grid item xs={12} md={8}>
          <SessionsChart data={stats.monthlySessionsData || []} />
        </Grid>
        
        {/* Distribución por materia */}
        <Grid item xs={12} md={4}>
          <SubjectDistribution data={stats.tutoriasBySubject || []} />
        </Grid>
        
        {/* Próximas sesiones */}
        <Grid item xs={12} md={8}>
          <UpcomingSessions 
            sessions={Array.isArray(upcomingSessions) 
              ? upcomingSessions.slice(0, 3) 
              : [] 
            } 
          />  
        </Grid>
        
        {/* Asesores destacados */}
        <Grid item xs={12} md={4}>
          <TopMentorsList mentors={stats.topTutores || []} />
        </Grid>
        
        {/* Sección de recursos recientes */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recursos Populares
            </Typography>
            {Array.isArray(stats.recentResources) && stats.recentResources.length > 0 ? (
              <Grid container spacing={2}>
                {stats.recentResources.map((resource, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <MenuBook color="primary" sx={{ mr: 1 }} />
                      <Box>
                        <Typography variant="body1">{resource.title}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {resource.downloads} descargas
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body1" color="text.secondary">
                No hay recursos disponibles.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;