import { 
  Box, Typography, Paper, Grid, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Chip 
} from '@mui/material';
import { CalendarMonth } from '@mui/icons-material';

const MentorInfo = ({ profile }) => {
  // Mapeo de días de la semana
  const weekDays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Acerca de Mí
          </Typography>
          <Typography variant="body1" paragraph>
            {profile.bio}
          </Typography>
          
          <Typography variant="subtitle1" fontWeight={500} gutterBottom sx={{ mt: 3 }}>
            Experiencia
          </Typography>
          <Typography variant="body1">
            {profile.experience}
          </Typography>
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Materias Destacadas
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Materia</TableCell>
                  <TableCell align="right">Calificación</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {profile.topSubjects.map((subject, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {subject.name}
                    </TableCell>
                    <TableCell align="right">
                      <Chip
                        label={subject.grade}
                        size="small"
                        color={subject.grade >= 90 ? 'success' : subject.grade >= 80 ? 'primary' : 'default'}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Disponibilidad
          </Typography>
          <Box>
            {profile.availability.map((slot, index) => (
              <Box 
                key={index}
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 1,
                  p: 1,
                  borderRadius: 1,
                  bgcolor: 'background.default'
                }}
              >
                <CalendarMonth color="action" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  {weekDays[slot.day]}, {slot.startTime} - {slot.endTime}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default MentorInfo;