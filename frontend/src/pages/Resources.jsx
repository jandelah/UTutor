// frontend/src/pages/Resources.jsx
import { Container, Typography, Box } from '@mui/material';
import PageHeader from '../components/common/PageHeader';

const Resources = () => {
  return (
    <Container maxWidth="lg">
      <PageHeader 
        title="Recursos" 
        subtitle="Biblioteca de materiales educativos compartidos"
        breadcrumbs={[{ text: 'Recursos', link: '/resources' }]}
      />
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Página de recursos en desarrollo
        </Typography>
      </Box>
    </Container>
  );
};

export default Resources;