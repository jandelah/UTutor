import { Container, Typography, Box, Paper, Grid } from '@mui/material';
import PageHeader from '../components/common/PageHeader';

const About = () => {
  return (
    <Container maxWidth="lg">
      <PageHeader 
        title="Acerca de MentorTech UTSJR" 
        subtitle="Conoce más sobre nuestra plataforma de mentoría entre pares"
        breadcrumbs={[{ text: 'Acerca de', link: '/about' }]}
      />
      
      <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Nuestra Misión
        </Typography>
        <Typography variant="body1" paragraph>
          MentorTech UTSJR es una plataforma diseñada para fortalecer la comunidad universitaria 
          a través de la mentoría entre pares. Buscamos facilitar la transferencia de conocimiento 
          entre estudiantes, reducir la brecha de aprendizaje y fomentar habilidades de liderazgo 
          y colaboración.
        </Typography>
        <Typography variant="body1" paragraph>
          Nuestra misión es crear un ecosistema de aprendizaje colaborativo donde los estudiantes 
          puedan compartir sus conocimientos y experiencias, acelerando el desarrollo técnico y 
          profesional de toda la comunidad UTSJR.
        </Typography>
      </Paper>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 4, height: '100%' }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Beneficios para Mentees
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <Typography component="li" variant="body1" paragraph>
                Mejor comprensión de materias difíciles
              </Typography>
              <Typography component="li" variant="body1" paragraph>
                Desarrollo acelerado de habilidades técnicas
              </Typography>
              <Typography component="li" variant="body1" paragraph>
                Integración más rápida al ambiente universitario
              </Typography>
              <Typography component="li" variant="body1" paragraph>
                Reducción de estrés académico
              </Typography>
              <Typography component="li" variant="body1" paragraph>
                Orientación personalizada en trayectoria académica
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 4, height: '100%' }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Beneficios para Mentores
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <Typography component="li" variant="body1" paragraph>
                Desarrollo de habilidades de liderazgo y comunicación
              </Typography>
              <Typography component="li" variant="body1" paragraph>
                Refuerzo de conocimientos técnicos
              </Typography>
              <Typography component="li" variant="body1" paragraph>
                Reconocimiento académico formal
              </Typography>
              <Typography component="li" variant="body1" paragraph>
                Experiencia relevante para CV profesional
              </Typography>
              <Typography component="li" variant="body1" paragraph>
                Satisfacción por contribución a comunidad universitaria
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      <Box sx={{ my: 5 }}>
        <Typography variant="h5" component="h2" gutterBottom align="center">
          Nuestro Equipo
        </Typography>
        <Typography variant="body1" paragraph align="center" color="text.secondary">
          MentorTech UTSJR es un proyecto desarrollado por estudiantes para estudiantes.
        </Typography>
        
        {/* Aquí se podría añadir una galería con fotos del equipo */}
      </Box>
    </Container>
  );
};

export default About;