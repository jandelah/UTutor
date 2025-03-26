import { Box, Container, Typography, Link, Grid, Divider } from '@mui/material';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <Box 
      component="footer" 
      sx={{ 
        py: 4, 
        mt: 'auto',
        backgroundColor: 'primary.main',
        color: 'white'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              UTutor SJR
            </Typography>
            <Typography variant="body2">
              Plataforma de mentoría entre pares para estudiantes de la Universidad Tecnológica de San Juan del Río.
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Enlaces
            </Typography>
            <Link href="/" color="inherit" display="block" sx={{ mb: 1 }}>
              Inicio
            </Link>
            <Link href="/about" color="inherit" display="block" sx={{ mb: 1 }}>
              Acerca de
            </Link>
            <Link href="/faq" color="inherit" display="block" sx={{ mb: 1 }}>
              Preguntas Frecuentes
            </Link>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Contacto
            </Typography>
            <Typography variant="body2" paragraph>
              Universidad Tecnológica de San Juan del Río
            </Typography>
            <Typography variant="body2">
              San Juan del Río, Querétaro, México
            </Typography>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.2)' }} />
        
        <Typography variant="body2" align="center">
          © {currentYear} UTutor SJR. Todos los derechos reservados.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;