import { 
    Paper, Typography, List, ListItem, ListItemAvatar, 
    ListItemText, Avatar, Box, Rating, useTheme 
  } from '@mui/material';
  import { Star } from '@mui/icons-material';
  
  const TopMentorsList = ({ mentors = [] }) => {
    const theme = useTheme();
    
    return (
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
        <Typography variant="h6" gutterBottom>
          Mentores Destacados
        </Typography>
        
        <List sx={{ pt: 0 }}>
          {mentors.map((mentor, index) => (
            <ListItem
              key={mentor.id}
              alignItems="flex-start"
              sx={{
                px: 2,
                py: 1.5,
                mb: 1,
                bgcolor: index === 0 ? `${theme.palette.primary.light}15` : 'transparent',
                borderRadius: 1
              }}
            >
              <ListItemAvatar>
                <Avatar
                  alt={mentor.name}
                  src={`https://i.pravatar.cc/150?img=${mentor.id}`}
                  sx={{ 
                    width: 45, 
                    height: 45, 
                    border: index === 0 ? `2px solid ${theme.palette.primary.main}` : 'none'
                  }}
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="subtitle1" component="span" fontWeight={500}>
                      {mentor.name}
                    </Typography>
                    {index === 0 && (
                      <Star 
                        sx={{ 
                          ml: 1, 
                          color: theme.palette.warning.main, 
                          fontSize: 18 
                        }} 
                      />
                    )}
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.secondary" component="span">
                      {mentor.sessions} sesiones completadas
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <Rating
                        value={mentor.rating}
                        precision={0.1}
                        size="small"
                        readOnly
                      />
                      <Typography 
                        variant="body2" 
                        component="span" 
                        sx={{ ml: 1, color: theme.palette.text.secondary }}
                      >
                        ({mentor.rating})
                      </Typography>
                    </Box>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    );
  };
  
  export default TopMentorsList;