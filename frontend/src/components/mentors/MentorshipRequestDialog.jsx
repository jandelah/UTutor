import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, Chip, Typography, Box, Alert, 
  CircularProgress, Divider, Avatar
} from '@mui/material';
import { School, CheckCircle } from '@mui/icons-material';
import { useAuth } from '../../AuthContext';
import { createMentorship } from '../../services/api/mentorshipService';

const MentorshipRequestDialog = ({ open, onClose, mentor, onSuccess }) => {
  const { currentUser } = useAuth();
  const [focusAreas, setFocusAreas] = useState([]);
  const [focusInput, setFocusInput] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Add focus area from input
  const handleAddFocusArea = () => {
    if (focusInput && !focusAreas.includes(focusInput)) {
      setFocusAreas([...focusAreas, focusInput]);
      setFocusInput('');
    }
  };
  
  // Remove a focus area
  const handleRemoveFocusArea = (area) => {
    setFocusAreas(focusAreas.filter(a => a !== area));
  };
  
  // Add expertise areas from mentor
  const handleAddExpertiseArea = (area) => {
    if (!focusAreas.includes(area)) {
      setFocusAreas([...focusAreas, area]);
    }
  };
  
  // Send mentorship request
  const handleSubmit = async () => {
    if (focusAreas.length === 0) {
      setError("Por favor, especifica al menos un área de enfoque");
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const mentorshipData = {
        tutor_id: mentor.id,
        tutorado_id: currentUser?.id,
        notes: notes,
        start_date: new Date().toISOString().split('T')[0],
        status: 'PENDING',
        focus_areas: focusAreas
      };
      
      await createMentorship(mentorshipData);
      setSuccess(true);
      
      // Notify parent
      if (onSuccess) {
        onSuccess();
      }
      
      // Reset and close after success
      setTimeout(() => {
        setSuccess(false);
        onClose();
        
        // Reset form for next time
        setFocusAreas([]);
        setFocusInput('');
        setNotes('');
      }, 2000);
    } catch (err) {
      console.error("Error creating mentorship:", err);
      setError("Error al enviar la solicitud. Por favor, inténtalo más tarde.");
    } finally {
      setLoading(false);
    }
  };
  
  // Get mentor's expertise areas
  const getExpertiseAreas = () => {
    return mentor.expertise_areas?.map(item => item.area) || [];
  };
  
  return (
    <Dialog 
      open={open} 
      onClose={!loading ? onClose : undefined} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle>
        Solicitar Asesoría con {mentor?.name}
      </DialogTitle>
      
      <DialogContent dividers>
        {success ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              ¡Solicitud Enviada!
            </Typography>
            <Typography variant="body1">
              Tu solicitud ha sido enviada. El asesor te contactará pronto.
            </Typography>
          </Box>
        ) : (
          <>
            {/* Mentor info */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar
                src={mentor?.avatar_url}
                alt={mentor?.name}
                sx={{ width: 50, height: 50, mr: 2 }}
              >
                {mentor?.name?.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="h6">
                  {mentor?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {mentor?.career}, {mentor?.semester}° semestre
                </Typography>
              </Box>
            </Box>
            
            <Divider sx={{ mb: 3 }} />
            
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            
            <Typography variant="subtitle1" gutterBottom>
              Áreas de enfoque
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Selecciona las áreas en las que te gustaría recibir asesoría:
            </Typography>
            
            {/* Expertise areas from mentor */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Áreas de experiencia del asesor:
              </Typography>
              {getExpertiseAreas().length > 0 ? (
                getExpertiseAreas().map((area, index) => (
                  <Chip
                    key={index}
                    label={area}
                    color={focusAreas.includes(area) ? "primary" : "default"}
                    variant={focusAreas.includes(area) ? "filled" : "outlined"}
                    onClick={() => handleAddExpertiseArea(area)}
                    sx={{ m: 0.5 }}
                  />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No se especificaron áreas de expertise
                </Typography>
              )}
            </Box>
            
            {/* Custom focus areas */}
            <Typography variant="subtitle2" gutterBottom>
              Añadir área personalizada:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Escribe un área y presiona Enter o Añadir"
                value={focusInput}
                onChange={(e) => setFocusInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFocusArea();
                  }
                }}
                sx={{ mr: 1 }}
              />
              <Button 
                variant="outlined"
                onClick={handleAddFocusArea}
                disabled={!focusInput}
              >
                Añadir
              </Button>
            </Box>
            
            {/* Selected focus areas */}
            <Typography variant="subtitle2" gutterBottom>
              Áreas seleccionadas:
            </Typography>
            <Box sx={{ mb: 3, minHeight: 50 }}>
              {focusAreas.length > 0 ? (
                focusAreas.map((area, index) => (
                  <Chip
                    key={index}
                    label={area}
                    onDelete={() => handleRemoveFocusArea(area)}
                    color="primary"
                    sx={{ m: 0.5 }}
                  />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No hay áreas seleccionadas
                </Typography>
              )}
            </Box>
            
            {/* Notes */}
            <Typography variant="subtitle1" gutterBottom>
              Notas adicionales (opcional)
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Describe brevemente lo que esperas aprender, cuándo estás disponible, etc."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </>
        )}
      </DialogContent>
      
      {!success && (
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button 
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading || focusAreas.length === 0}
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
            {loading ? 'Enviando...' : 'Enviar Solicitud'}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default MentorshipRequestDialog;