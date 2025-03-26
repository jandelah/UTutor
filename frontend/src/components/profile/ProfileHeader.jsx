import { useState } from 'react';
import { 
  Box, Avatar, Typography, Button, Chip, 
  Paper, Grid, Rating, IconButton, Menu, MenuItem 
} from '@mui/material';
import { 
  Edit, School, MoreVert, Mail, CalendarMonth 
} from '@mui/icons-material';

const ProfileHeader = ({ user, profile, isMentor = false, isOwnProfile = true }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 2,
        mb: 3,
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} sm={3} md={2} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={user.avatar}
              alt={user.name}
              sx={{ width: 120, height: 120, border: '3px solid white', boxShadow: 3 }}
            />
            {isOwnProfile && (
              <IconButton
                size="small"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                }}
              >
                <Edit fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={9} md={10}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                {user.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <School color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1">
                  {user.career}, {user.semester}° Semestre
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Mail color="action" sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
              </Box>
              
              {isMentor && profile && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Rating value={profile.rating} precision={0.1} readOnly />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    ({profile.rating})
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                    • {profile.completedSessions} sesiones completadas
                  </Typography>
                </Box>
              )}
            </Box>
            
            <Box>
              {isOwnProfile ? (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Edit />}
                >
                  Editar Perfil
                </Button>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mb: 1 }}
                  >
                    {isMentor ? 'Solicitar Mentoría' : 'Ver Detalles'}
                  </Button>
                  <IconButton
                    onClick={handleMenuClick}
                    size="small"
                  >
                    <MoreVert />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={handleMenuClose}>Ver Calificaciones</MenuItem>
                    <MenuItem onClick={handleMenuClose}>Enviar Mensaje</MenuItem>
                    <MenuItem onClick={handleMenuClose}>Reportar Usuario</MenuItem>
                  </Menu>
                </Box>
              )}
            </Box>
          </Box>
          
          {profile && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                Áreas de {isMentor ? 'Expertise' : 'Interés'}
              </Typography>
              <Box>
                {(isMentor ? profile.expertiseAreas : profile.interestAreas).map((area, index) => (
                  <Chip
                    key={index}
                    label={area}
                    color="primary"
                    variant="outlined"
                    size="small"
                    sx={{ mr: 0.5, mb: 0.5 }}
                  />
                ))}
              </Box>
            </Box>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ProfileHeader;