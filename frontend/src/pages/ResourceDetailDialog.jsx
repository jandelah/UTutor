import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, Typography, Box, Divider, Chip,
  Button, Paper, List, ListItem, ListItemIcon, ListItemText,
  Avatar, Rating
} from '@mui/material';
import {
  DescriptionOutlined, CategoryOutlined, OpenInNew,
  CloudDownload, BookmarkBorder, Bookmark, Person,
  GetApp, Share
} from '@mui/icons-material';
import ResourceRating from './ResourceRating';
import { trackDownload } from '../../services/api/resourceService';

// Helper to get creator name
const getCreatorName = (creatorId) => {
  switch (creatorId) {
    case 1: return 'Ana García';
    case 2: return 'Carlos Mendoza';
    case 3: return 'Laura Jiménez';
    case 4: return 'Miguel Torres';
    case 5: return 'Sofia Ramírez';
    default: return 'Usuario desconocido';
  }
};

const ResourceDetailDialog = ({
  open,
  onClose,
  resource,
  savedResources = [],
  onToggleSave,
  onResourceUpdate
}) => {
  const [detailsResource, setDetailsResource] = useState(resource);

  // Update local state when resource changes
  if (resource && resource.id !== detailsResource?.id) {
    setDetailsResource(resource);
  }

  if (!detailsResource) return null;

  const handleDownload = async () => {
    try {
      // Track the download
      const updatedResource = await trackDownload(detailsResource.id);
      setDetailsResource(updatedResource);
      
      // Notify parent component
      if (onResourceUpdate) {
        onResourceUpdate(updatedResource);
      }
    } catch (error) {
      console.error('Error tracking download:', error);
    }
  };

  const handleRatingSubmitted = (updatedResource) => {
    setDetailsResource(updatedResource);
    
    // Notify parent component
    if (onResourceUpdate) {
      onResourceUpdate(updatedResource);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
    >
      <DialogTitle>
        {detailsResource.title}
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              Descripción
            </Typography>
            <Typography variant="body1" paragraph>
              {detailsResource.description}
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Detalles
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CategoryOutlined fontSize="small" color="action" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      <strong>Materia:</strong> {detailsResource.subject}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <DescriptionOutlined fontSize="small" color="action" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      <strong>Tipo:</strong> {detailsResource.type === 'DOCUMENT' ? 'Documento' : detailsResource.type === 'VIDEO' ? 'Video' : 'Enlace'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <GetApp fontSize="small" color="action" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      <strong>Descargas:</strong> {detailsResource.downloads}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Person fontSize="small" color="action" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      <strong>Creado por:</strong> {getCreatorName(detailsResource.createdBy)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
            
            <Typography variant="h6" gutterBottom>
              Temas
            </Typography>
            <Box sx={{ mb: 3 }}>
              {detailsResource.topics.map((topic, index) => (
                <Chip
                  key={index}
                  label={topic}
                  sx={{ mr: 0.5, mb: 0.5 }}
                />
              ))}
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 2, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                mb: 3 
              }}
            >
              {detailsResource.type === 'DOCUMENT' ? (
                <DescriptionOutlined sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
              ) : detailsResource.type === 'VIDEO' ? (
                <OpenInNew sx={{ fontSize: 64, color: 'secondary.main', mb: 2 }} />
              ) : (
                <OpenInNew sx={{ fontSize: 64, color: 'info.main', mb: 2 }} />
              )}
              
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth
                startIcon={<CloudDownload />}
                onClick={handleDownload}
                sx={{ mb: 1 }}
              >
                Descargar Recurso
              </Button>
              
              <Button 
                variant="outlined"
                fullWidth
                startIcon={savedResources.includes(detailsResource.id) ? <Bookmark /> : <BookmarkBorder />}
                onClick={() => onToggleSave && onToggleSave(detailsResource.id)}
                sx={{ mb: 1 }}
                color={savedResources.includes(detailsResource.id) ? "primary" : "inherit"}
              >
                {savedResources.includes(detailsResource.id) ? 'Guardado' : 'Guardar'}
              </Button>
              
              <Button 
                variant="outlined"
                fullWidth
                startIcon={<Share />}
              >
                Compartir
              </Button>
            </Paper>
            
            <Typography variant="h6" gutterBottom>
              Calificaciones y Reseñas
            </Typography>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Rating value={detailsResource.averageRating} precision={0.1} readOnly />
                <Typography variant="body2" color="text.secondary">
                  {detailsResource.averageRating} de 5 ({detailsResource.ratings.length} reseñas)
                </Typography>
              </Box>
              <ResourceRating 
                resourceId={detailsResource.id} 
                onRatingSubmitted={handleRatingSubmitted}
              />
            </Box>
            
            <List sx={{ p: 0 }}>
              {detailsResource.ratings.map((rating, index) => (
                <ListItem key={index} alignItems="flex-start" sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Avatar 
                      sx={{ width: 32, height: 32 }}
                      src={`https://i.pravatar.cc/150?img=${rating.userId}`}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle2">
                          {getCreatorName(rating.userId)}
                        </Typography>
                        <Rating value={rating.score} size="small" readOnly />
                      </Box>
                    }
                    secondary={rating.comment || "Sin comentarios"}
                  />
                </ListItem>
              ))}
              
              {detailsResource.ratings.length === 0 && (
                <Box sx={{ py: 2, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    No hay reseñas todavía. ¡Sé el primero en calificar!
                  </Typography>
                </Box>
              )}
            </List>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResourceDetailDialog;
