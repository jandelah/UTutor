import { Box, Container, Typography, Button, Grid, Card, CardContent, CardMedia } from '@mui/material';
import { School, People, CalendarMonth, TrendingUp } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Home = () => {
  const features = [
    {
      icon: <School fontSize="large" color="primary" />,
      title: 'Asesoría Personalizada',
      description: 'Conecta con estudiantes avanzados que te ayudarán en materias específicas.'
    },
    {
      icon: <People fontSize="large" color="primary" />,
      title: 'Comunidad de Apoyo',
      description: 'Forma parte de una red colaborativa de estudiantes que comparten conocimientos.'
    },
    {
      icon: <CalendarMonth fontSize="large" color="primary" />,
      title: 'Sesiones Flexibles',
      description: 'Programa sesiones de asesoría que se adapten a tu horario académico.'
    },
    {
      icon: <TrendingUp fontSize="large" color="primary" />,
      title: 'Seguimiento de Progreso',
      description: 'Visualiza tu avance y el impacto de las asesorías en tu desempeño.'
    }
  ];
  
  return (
    <>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          borderRadius: 2,
          mb: 6
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="h2" component="h1" gutterBottom>
                Potencia tu desarrollo académico
              </Typography>
              <Typography variant="h5" paragraph>
                Conecta con asesores de la UTSJR para mejorar tus habilidades técnicas y profesionales.
              </Typography>
              <Box sx={{ mt: 4 }}>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  size="large"
                  component={Link}
                  to="/register"
                  sx={{ mr: 2 }}
                >
                  Comenzar Ahora
                </Button>
                <Button 
                  variant="outlined" 
                  color="inherit"
                  component={Link}
                  to="/about"
                >
                  Conocer Más
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box 
                component="img"
                src="https://placehold.co/600x400/12a778/FFFFFF?text=UTutor"
                alt="Estudiantes colaborando"
                sx={{ 
                  width: '100%', 
                  borderRadius: 2,
                  boxShadow: 6
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Typography variant="h3" component="h2" align="center" gutterBottom>
          Características Principales
        </Typography>
        <Typography 
          variant="subtitle1" 
          align="center" 
          color="text.secondary"
          sx={{ mb: 6 }}
        >
          Descubre todo lo que UTutor puede ofrecerte
        </Typography>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      
      {/* How It Works Section */}
      <Box sx={{ bgcolor: 'background.paper', py: 6, mb: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" align="center" gutterBottom>
            Cómo Funciona
          </Typography>
          <Typography 
            variant="subtitle1" 
            align="center" 
            color="text.secondary"
            sx={{ mb: 6 }}
          >
            Tres simples pasos para comenzar tu experiencia de asesoría
          </Typography>
          
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image="https://placehold.co/400x200/0056b3/FFFFFF?text=Paso+1"
                  alt="Paso 1"
                />
                <CardContent>
                  <Typography variant="h5" component="h3" gutterBottom>
                    1. Crea tu perfil
                  </Typography>
                  <Typography variant="body1">
                    Regístrate y configura tu perfil con tus áreas de interés o experiencia.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image="https://placehold.co/400x200/0056b3/FFFFFF?text=Paso+2"
                  alt="Paso 2"
                />
                <CardContent>
                  <Typography variant="h5" component="h3" gutterBottom>
                    2. Encuentra tu match
                  </Typography>
                  <Typography variant="body1">
                    Busca asesores o asesorados según tus necesidades académicas.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image="https://placehold.co/400x200/0056b3/FFFFFF?text=Paso+3"
                  alt="Paso 3"
                />
                <CardContent>
                  <Typography variant="h5" component="h3" gutterBottom>
                    3. Programa sesiones
                  </Typography>
                  <Typography variant="body1">
                    Coordina y participa en sesiones de asesoría, compartiendo conocimientos.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* CTA Section */}
      <Container maxWidth="md" sx={{ mb: 6 }}>
        <Box 
          sx={{ 
            bgcolor: 'secondary.main', 
            color: 'white', 
            p: 6, 
            borderRadius: 4,
            textAlign: 'center'
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom>
            ¿Listo para comenzar?
          </Typography>
          <Typography variant="subtitle1" paragraph>
            Únete a UTutor y forma parte de nuestra comunidad de aprendizaje colaborativo.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            component={Link}
            to="/register"
            sx={{ mt: 2 }}
          >
            Registrarme Ahora
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default Home;