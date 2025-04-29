import { Paper, Typography, Box } from '@mui/material';

const StatCard = ({ title = '', value = 0, icon = null, color = 'primary' }) => {
  // Ensure the value is properly displayed even if it's undefined
  const displayValue = value !== undefined && value !== null ? value : 0;
  
  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 2,
        height: '100%',
        borderLeft: 4,
        borderColor: `${color}.main`,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" component="div" fontWeight={600}>
            {displayValue}
          </Typography>
        </Box>
        {icon && (
          <Box
            sx={{
              bgcolor: `${color}.light`,
              color: `${color}.dark`,
              borderRadius: '50%',
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {icon}
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default StatCard;