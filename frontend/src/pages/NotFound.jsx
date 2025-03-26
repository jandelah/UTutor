import { Box, Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { SentimentDissatisfied } from '@mui/icons-material';

const NotFound = () => {
  return (
    <Container maxWidth="md">
      <Box 
        sx={{ 
          py: 8, 
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center' 
        }}
      >
        <SentimentDissatisfied sx={{ fontSize: 100, color: 'text.secondary', mb: 4 }} />
        
        <Typography variant="h2" component="h1" gutterBottom>
          404
        </Typography>
        
        <Typography variant="h4" component="h2" gutterBottom>
          Página no encontrada
        </Typography>
        
        <Typography variant="body1" paragraph color="text.secondary">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </Typography>
        
        <Button 
          variant="contained" 
          color="primary" 
          component={Link} 
          to="/"
          size="large"
          sx={{ mt: 2 }}
        >
          Volver al Inicio
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;