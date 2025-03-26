// frontend/src/pages/Search.jsx
import { Container, Typography, Box } from '@mui/material';
import PageHeader from '../components/common/PageHeader';

const Search = () => {
  return (
    <Container maxWidth="lg">
      <PageHeader 
        title="Buscar Mentores" 
        subtitle="Encuentra mentores que puedan ayudarte en tus áreas de interés"
        breadcrumbs={[{ text: 'Buscar', link: '/search' }]}
      />
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Página de búsqueda en desarrollo
        </Typography>
      </Box>
    </Container>
  );
};

export default Search;