import { useState } from 'react';
import { 
  Box, Button, Rating, Typography, TextField, 
  Dialog, DialogTitle, DialogContent, DialogActions,
  Alert
} from '@mui/material';
import { StarOutlined, Star } from '@mui/icons-material';
import { useAuth } from '../../AuthContext';
import { rateResource } from '../../services/api/resourceService';

const ResourceRating = ({ resourceId, onRatingSubmitted }) => {
  const { currentUser } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hover, setHover] = useState(-1);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const handleOpenDialog = () => {
    setDialogOpen(true);
    setRating(0);
    setComment('');
    setError(null);
    setSuccess(false);
  };
  
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };
  
  const handleSubmitRating = async () => {
    if (rating === 0) {
      setError('Por favor selecciona una calificación');
      return;
    }
    
    setError(null);
    setSubmitting(true);
    
    try {
      const result = await rateResource(
        resourceId, 
        currentUser?.id || 1, 
        rating, 
        comment
      );
      
      setSuccess(true);
      
      // Notify parent component
      if (onRatingSubmitted) {
        onRatingSubmitted(result);
      }
      
      // Close dialog after a short delay
      setTimeout(() => {
        handleCloseDialog();
      }, 1500);
    } catch (error) {
      setError('Error al enviar la calificación. Por favor intenta de nuevo.');
      console.error('Rating error:', error);
    } finally {
      setSubmitting(false);
    }
  };
  
  const getStarLabelText = (value) => {
    const labels = [
      'Muy malo',
      'Malo',
      'Regular',
      'Bueno',
      'Excelente'
    ];
    
    return labels[value - 1] || '';
  };
  
  return (
    <>
      <Button 
        variant="text" 
        startIcon={<StarOutlined />}
        size="small"
        onClick={handleOpenDialog}
      >
        Calificar
      </Button>
      
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Calificar Recurso
        </DialogTitle>
        <DialogContent>
          {success ? (
            <Alert severity="success" sx={{ mb: 2 }}>
              ¡Gracias por tu calificación!
            </Alert>
          ) : (
            <>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  ¿Qué te pareció este recurso?
                </Typography>
                <Rating
                  size="large"
                  value={rating}
                  precision={1}
                  onChange={(event, newValue) => {
                    setRating(newValue);
                  }}
                  onChangeActive={(event, newHover) => {
                    setHover(newHover);
                  }}
                  emptyIcon={<StarOutlined style={{ opacity: 0.55 }} fontSize="inherit" />}
                  icon={<Star fontSize="inherit" />}
                />
                <Box sx={{ ml: 2, mt: 1, mb: 2 }}>
                  {rating !== null && (
                    <Typography variant="body2" color="text.secondary">
                      {hover !== -1 
                        ? getStarLabelText(hover) 
                        : rating !== 0 
                          ? getStarLabelText(rating) 
                          : 'Selecciona una calificación'}
                    </Typography>
                  )}
                </Box>
              </Box>
              
              <TextField
                fullWidth
                label="Comentario (opcional)"
                multiline
                rows={3}
                variant="outlined"
                placeholder="Comparte tu opinión sobre este recurso"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                sx={{ mt: 2 }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmitRating} 
            color="primary"
            variant="contained"
            disabled={submitting || success}
          >
            {submitting ? 'Enviando...' : 'Enviar Calificación'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ResourceRating;
