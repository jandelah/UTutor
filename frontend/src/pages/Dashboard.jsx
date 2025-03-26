import { useEffect, useState } from 'react';
import { Container, Grid, Typography, Box } from '@mui/material';
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

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener datos del dashboard y sesiones próximas en paralelo
        const [statsData, sessionsData] = await Promise.all([
          getDashboardStats(),
          getUpcomingSessions()
        ]);
        
        setStats(statsData);
        setUpcomingSessions(sessionsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (loading) {
    return <LoadingSpinner message="Cargando dashboard..." />;
  }
  
  return (
    <Container maxWidth="lg">
      <PageHeader 
        title="Dashboard" 
        subtitle="Visualiza el progreso y estado de tus mentorías"
      />
      
      <Grid container spacing={3}>
        {/* Tarjetas de estadísticas */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Mentorías Activas" 
            value={stats.activeMentorships} 
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
            value={stats.averageMentorRating.toFixed(1)} 
            icon={<Assessment />}
            color="info"
          />
        </Grid>
        
        {/* Gráfica de sesiones mensuales */}
        <Grid item xs={12} md={8}>
          <SessionsChart data={stats.monthlySessionsData} />
        </Grid>
        
        {/* Distribución por materia */}
        <Grid item xs={12} md={4}>
          <SubjectDistribution data={stats.mentorshipsBySubject} />
        </Grid>
        
        {/* Próximas sesiones */}
        <Grid item xs={12} md={8}>
          <UpcomingSessions sessions={upcomingSessions.slice(0, 3)} />
        </Grid>
        
        {/* Mentores destacados */}
        <Grid item xs={12} md={4}>
          <TopMentorsList mentors={stats.topMentors} />
        </Grid>
        
        {/* Sección de recursos recientes */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recursos Populares
            </Typography>
            
            {/* Aquí iría un componente para mostrar recursos populares */}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;