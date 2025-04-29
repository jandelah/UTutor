import { 
  Box, Typography, Paper, Grid, List, 
  ListItem, ListItemText, Chip, LinearProgress 
} from '@mui/material';
import { School, Flag } from '@mui/icons-material';

const MenteeInfo = ({ profile }) => {
  // Función para obtener color según nivel de riesgo académico
  const getRiskColor = (level) => {
    switch (level) {
      case 0: return 'success';
      case 1: return 'info';
      case 2: return 'warning';
      case 3: return 'error';
      default: return 'primary';
    }
  };
  
  // Función para obtener texto según nivel de riesgo académico
  const getRiskText = (level) => {
    switch (level) {
      case 0: return 'Sin riesgo';
      case 1: return 'Bajo';
      case 2: return 'Medio';
      case 3: return 'Alto';
      default: return 'No disponible';
    }
  };
  
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Materias Actuales
          </Typography>
          <List>
            {profile.currentSubjects.map((subject, index) => (
              <ListItem key={index} sx={{ px: 1, py: 0.5 }}>
                <School color="action" sx={{ mr: 2 }} />
                <ListItemText primary={subject} />
              </ListItem>
            ))}
          </List>
          
          {profile.academicRiskLevel !== undefined && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Nivel de Riesgo Académico
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Flag sx={{ color: getRiskColor(profile.academicRiskLevel), mr: 1 }} />
                <Typography variant="body1" fontWeight={500}>
                  {getRiskText(profile.academicRiskLevel)}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={profile.academicRiskLevel * 33.33}
                color={getRiskColor(profile.academicRiskLevel)}
                sx={{ height: 10, borderRadius: 5 }}
              />
            </Box>
          )}
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Objetivos de Aprendizaje
          </Typography>
          <List>
            {profile.learningGoals.map((goal, index) => (
              <ListItem key={index} sx={{ px: 1, py: 0.5 }}>
                <ListItemText
                  primary={
                    <Box>
                      <Chip
                        size="small"
                        label={index + 1}
                        color="primary"
                        sx={{ mr: 1, minWidth: 28 }}
                      />
                      {goal}
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default MenteeInfo;