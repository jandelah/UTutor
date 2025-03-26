import { useState } from 'react';
import { 
  Paper, Typography, List, ListItem, ListItemText, Box,
  Chip, IconButton, Tooltip, Divider
} from '@mui/material';
import { 
  VideoCameraFront, LocationOn, OpenInNew, 
  CheckCircleOutline, Event 
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const UpcomingSessions = ({ sessions = [] }) => {
  // Función para formatear fecha
  const formatDate = (dateString) => {
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    return new Date(dateString).toLocaleDateString('es-MX', options);
  };
  
  // Función para formatear hora
  const formatTime = (timeString) => {
    return timeString;
  };
  
  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Próximas Sesiones
        </Typography>
        <Tooltip title="Ver todas las sesiones">
          <IconButton 
            size="small" 
            component={Link} 
            to="/sessions"
            color="primary"
          >
            <OpenInNew fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      
      {sessions.length === 0 ? (
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Event sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
          <Typography color="text.secondary">
            No tienes sesiones programadas
          </Typography>
        </Box>
      ) : (
        <List sx={{ pt: 0 }}>
          {sessions.map((session, index) => (
            <Box key={session.id}>
              {index > 0 && <Divider sx={{ my: 1 }} />}
              <ListItem 
                sx={{ px: 0, py: 1.5 }}
                secondaryAction={
                  <Tooltip title="Ver detalles">
                    <IconButton 
                      edge="end" 
                      component={Link} 
                      to={`/sessions/${session.id}`}
                      size="small"
                    >
                      <OpenInNew fontSize="small" />
                    </IconButton>
                  </Tooltip>
                }
              >
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" component="div" fontWeight={500}>
                      {session.title}
                    </Typography>
                  }
                  secondary={
                    <Box sx={{ mt: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Event fontSize="small" color="action" sx={{ mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(session.date)} • {formatTime(session.startTime)} - {formatTime(session.endTime)}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {session.mode === 'VIRTUAL' ? (
                          <VideoCameraFront fontSize="small" color="primary" sx={{ mr: 1 }} />
                        ) : (
                          <LocationOn fontSize="small" color="error" sx={{ mr: 1 }} />
                        )}
                        <Typography variant="body2" color="text.secondary">
                          {session.location}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mt: 1 }}>
                        {session.topics.map((topic, idx) => (
                          <Chip
                            key={idx}
                            label={topic}
                            size="small"
                            sx={{ mr: 0.5, mb: 0.5, fontSize: '0.7rem' }}
                          />
                        ))}
                      </Box>
                    </Box>
                  }
                />
              </ListItem>
            </Box>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default UpcomingSessions;