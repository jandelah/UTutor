// frontend/src/pages/Mentorships.jsx
import { Container, Typography, Box } from '@mui/material';
import PageHeader from '../components/common/PageHeader';

const Mentorships = () => {
  return (
    <Container maxWidth="lg">
      <PageHeader 
        title="Mis Mentorías" 
        subtitle="Gestiona tus relaciones de mentoría actuales"
        breadcrumbs={[{ text: 'Mentorías', link: '/mentorships' }]}
      />
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Página de mentorías en desarrollo
        </Typography>
      </Box>
    </Container>
  );
};

export default Mentorships;