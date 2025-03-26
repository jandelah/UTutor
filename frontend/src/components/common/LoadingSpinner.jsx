import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingSpinner = ({ message = 'Cargando...' }) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      py: 8
    }}>
      <CircularProgress size={60} />
      {message && (
        <Typography variant="h6" sx={{ mt: 2 }}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default LoadingSpinner;