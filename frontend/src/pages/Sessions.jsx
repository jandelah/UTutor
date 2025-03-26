// frontend/src/pages/Sessions.jsx
import { Container, Typography, Box } from '@mui/material';
import PageHeader from '../components/common/PageHeader';

const Sessions = () => {
  return (
    <Container maxWidth="lg">
      <PageHeader 
        title="Sesiones" 
        subtitle="Programa y gestiona tus sesiones de mentoría"
        breadcrumbs={[{ text: 'Sesiones', link: '/sessions' }]}
      />
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Página de sesiones en desarrollo
        </Typography>
      </Box>
    </Container>
  );
};

export default Sessions;