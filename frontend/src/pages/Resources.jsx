import { useState, useEffect } from 'react';
import { 
  Container, Grid, Box, Paper, Typography, Tabs, Tab,
  Card, CardContent, CardActions, Button, Chip, Rating,
  TextField, InputAdornment, IconButton, Divider, Avatar,
  Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, MenuItem, Menu,
  Link as MuiLink, Tooltip, List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import { 
  Search, FilterList, CloudDownload, Share, Favorite, FavoriteBorder,
  MoreVert, CategoryOutlined, SchoolOutlined, DescriptionOutlined, 
  StarOutline, Add, Sort, CloudUpload, GetApp, OpenInNew,
  BookmarkBorder, Bookmark, Person, VisibilityOutlined, SortByAlpha
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { 
  getResources, 
  getResourcesBySubject, 
  getTopRatedResources 
} from '../services/api/resourceService';

const Resources = () => {
  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    subject: '',
    rating: 0
  });
  const [sortOption, setSortOption] = useState('date');
  const [savedResources, setSavedResources] = useState([]);
  
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const data = await getResources();
        setResources(data);
        
        // Simulate saved resources (in a real app, this would come from the backend)
        setSavedResources([data[0].id, data[2].id]);
        
        // Apply initial filtering based on active tab
        filterResourcesByTab(data, tabValue);
      } catch (error) {
        console.error('Error fetching resources:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchResources();
  }, []);
  
  const filterResourcesByTab = (data, tab) => {
    let filtered = [...data];
    
    switch (tab) {
      case 0: // All resources
        break;
      case 1: // Documents
        filtered = filtered.filter(resource => resource.type === 'DOCUMENT');
        break;
      case 2: // Videos
        filtered = filtered.filter(resource => resource.type === 'VIDEO');
        break;
      case 3: // Saved
        filtered = filtered.filter(resource => savedResources.includes(resource.id));
        break;
      default:
        break;
    }
    
    applyFiltersAndSort(filtered);
  };
  
  const applyFiltersAndSort = (resourceList) => {
    let filtered = [...resourceList];
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        resource => 
          resource.title.toLowerCase().includes(term) ||
          resource.description.toLowerCase().includes(term) ||
          resource.topics.some(topic => topic.toLowerCase().includes(term))
      );
    }
    
    // Apply filters
    if (filters.type) {
      filtered = filtered.filter(resource => resource.type === filters.type);
    }
    
    if (filters.subject) {
      filtered = filtered.filter(resource => resource.subject === filters.subject);
    }
    
    if (filters.rating > 0) {
      filtered = filtered.filter(resource => resource.averageRating >= filters.rating);
    }
    
    // Apply sorting
    switch (sortOption) {
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'rating':
        filtered.sort((a, b) => b.averageRating - a.averageRating);
        break;
      case 'downloads':
        filtered.sort((a, b) => b.downloads - a.downloads);
        break;
      case 'date':
      default:
        // Assuming newer resources have higher IDs in our mock data
        filtered.sort((a, b) => b.id - a.id);
        break;
    }
    
    setFilteredResources(filtered);
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    filterResourcesByTab(resources, newValue);
  };
  
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    applyFiltersAndSort(
      resources.filter(resource => {
        if (tabValue === 1) return resource.type === 'DOCUMENT';
        if (tabValue === 2) return resource.type === 'VIDEO';
        if (tabValue === 3) return savedResources.includes(resource.id);
        return true;
      })
    );
  };
  
  const handleSortClick = (event) => {
    setSortAnchorEl(event.currentTarget);
  };
  
  const handleSortClose = () => {
    setSortAnchorEl(null);
  };
  
  const handleSortOptionSelect = (option) => {
    setSortOption(option);
    handleSortClose();
    applyFiltersAndSort(filteredResources);
  };
  
  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };
  
  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };
  
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    const newFilters = {
      ...filters,
      [name]: value
    };
    setFilters(newFilters);
  };
  
  const applyFilters = () => {
    filterResourcesByTab(resources, tabValue);
    handleFilterClose();
  };
  
  const resetFilters = () => {
    setFilters({
      type: '',
      subject: '',
      rating: 0
    });
    setSearchTerm('');
    filterResourcesByTab(resources, tabValue);
    handleFilterClose();
  };
  
  const handleResourceClick = (resource) => {
    setSelectedResource(resource);
    setDetailsOpen(true);
  };
  
  const handleDetailsClose = () => {
    setDetailsOpen(false);
  };
  
  const toggleSaveResource = (resourceId) => {
    if (savedResources.includes(resourceId)) {
      setSavedResources(savedResources.filter(id => id !== resourceId));
    } else {
      setSavedResources([...savedResources, resourceId]);
    }
    
    // If we're on the saved tab, we need to update the filtered resources
    if (tabValue === 3) {
      filterResourcesByTab(resources, 3);
    }
  };
  
  // Helper function to format date (in a real app, resources would have real dates)
  const formatDate = (resourceId) => {
    // Using the resource ID to simulate a date for our mock data
    const date = new Date();
    date.setDate(date.getDate() - (resourceId * 3));
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  if (loading) {
    return <LoadingSpinner message="Cargando recursos..." />;
  }
  
  return (
    <Container maxWidth="lg">
      <PageHeader 
        title="Recursos Educativos" 
        subtitle="Explora y comparte material educativo para reforzar el aprendizaje"
        breadcrumbs={[{ text: 'Recursos', link: '/resources' }]}
      />
      
      <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <TextField
            placeholder="Buscar recursos..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ width: { xs: '100%', sm: '60%', md: '40%' } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <Box>
            <Button 
              variant="outlined"
              startIcon={<FilterList />}
              onClick={handleFilterClick}
              sx={{ mr: 1 }}
            >
              Filtrar
            </Button>
            <Button 
              variant="outlined"
              startIcon={<Sort />}
              onClick={handleSortClick}
              sx={{ mr: 1 }}
            >
              Ordenar
            </Button>
            <Button 
              variant="contained" 
              color="primary"
              startIcon={<CloudUpload />}
              component={Link}
              to="/resources/upload"
            >
              Subir Recurso
            </Button>
          </Box>
        </Box>
        
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
        >
          <Tab label="Todos" />
          <Tab label="Documentos" />
          <Tab label="Videos" />
          <Tab label="Guardados" />
        </Tabs>
        
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          {filteredResources.length} {filteredResources.length === 1 ? 'recurso encontrado' : 'recursos encontrados'}
        </Typography>
        
        {filteredResources.length === 0 ? (
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              justifyContent: 'center',
              py: 6
            }}
          >
            <DescriptionOutlined sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No se encontraron recursos
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              {searchTerm || (filters.type || filters.subject || filters.rating > 0) 
                ? 'Prueba con otros filtros de búsqueda'
                : tabValue === 3 
                  ? 'No tienes recursos guardados' 
                  : 'No hay recursos disponibles en esta categoría'}
            </Typography>
            {(searchTerm || filters.type || filters.subject || filters.rating > 0) && (
              <Button 
                variant="outlined" 
                onClick={resetFilters}
              >
                Limpiar filtros
              </Button>
            )}
            
            {tabValue === 3 && savedResources.length === 0 && (
              <Button 
                variant="contained" 
                color="primary"
                component={Link}
                to="/resources"
                onClick={() => setTabValue(0)}
                sx={{ mt: 2 }}
              >
                Explorar recursos
              </Button>
            )}
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredResources.map((resource) => (
              <Grid item xs={12} sm={6} md={4} key={resource.id}>
                <Card 
                  elevation={2} 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative'
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                    <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                      <IconButton 
                        size="small"
                        onClick={() => toggleSaveResource(resource.id)}
                        color={savedResources.includes(resource.id) ? "primary" : "default"}
                      >
                        {savedResources.includes(resource.id) ? <Bookmark /> : <BookmarkBorder />}
                      </IconButton>
                    </Box>
                    
                    <Typography 
                      variant="h6" 
                      component="div" 
                      gutterBottom
                      sx={{ pr: 4 }} // Space for the bookmark icon
                    >
                      {resource.title}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Chip 
                        label={resource.type === 'DOCUMENT' ? 'Documento' : 'Video'} 
                        size="small"
                        color={resource.type === 'DOCUMENT' ? "primary" : "secondary"}
                        variant="outlined"
                        icon={resource.type === 'DOCUMENT' ? <DescriptionOutlined /> : <OpenInNew />}
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(resource.id)}
                      </Typography>
                    </Box>
                    
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        mb: 2,
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 3,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {resource.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CategoryOutlined fontSize="small" color="action" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {resource.subject}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      {resource.topics.slice(0, 3).map((topic, index) => (
                        <Chip
                          key={index}
                          label={topic}
                          size="small"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                      {resource.topics.length > 3 && (
                        <Chip 
                          label={`+${resource.topics.length - 3}`} 
                          size="small" 
                          variant="outlined" 
                        />
                      )}
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Rating 
                          value={resource.averageRating} 
                          precision={0.5} 
                          size="small" 
                          readOnly 
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                          ({resource.averageRating})
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <GetApp fontSize="small" color="action" sx={{ mr: 0.5 }} />
                        <Typography variant="body2" color="text.secondary">
                          {resource.downloads}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                  
                  <Divider />
                  
                  <CardActions>
                    <Button 
                      size="small" 
                      startIcon={<OpenInNew />}
                      onClick={() => handleResourceClick(resource)}
                    >
                      Ver detalles
                    </Button>
                    <Button 
                      size="small" 
                      color="primary" 
                      startIcon={<CloudDownload />}
                      component="a"
                      href={resource.url}
                      target="_blank"
                    >
                      Descargar
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
      
      {/* Sort Menu */}
      <Menu
        anchorEl={sortAnchorEl}
        open={Boolean(sortAnchorEl)}
        onClose={handleSortClose}
      >
        <MenuItem 
          onClick={() => handleSortOptionSelect('date')}
          selected={sortOption === 'date'}
        >
          Más recientes
        </MenuItem>
        <MenuItem 
          onClick={() => handleSortOptionSelect('title')}
          selected={sortOption === 'title'}
        >
          Título (A-Z)
        </MenuItem>
        <MenuItem 
          onClick={() => handleSortOptionSelect('rating')}
          selected={sortOption === 'rating'}
        >
          Mejor calificados
        </MenuItem>
        <MenuItem 
          onClick={() => handleSortOptionSelect('downloads')}
          selected={sortOption === 'downloads'}
        >
          Más descargados
        </MenuItem>
      </Menu>
      
      {/* Filter Menu */}
      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={handleFilterClose}
        sx={{ '& .MuiPaper-root': { width: 280 } }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle1" gutterBottom>
            Filtros
          </Typography>
          
          <FormControl fullWidth size="small" margin="dense">
            <InputLabel>Tipo</InputLabel>
            <Select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              label="Tipo"
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="DOCUMENT">Documentos</MenuItem>
              <MenuItem value="VIDEO">Videos</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl fullWidth size="small" margin="dense">
            <InputLabel>Materia</InputLabel>
            <Select
              name="subject"
              value={filters.subject}
              onChange={handleFilterChange}
              label="Materia"
            >
              <MenuItem value="">Todas</MenuItem>
              <MenuItem value="Desarrollo Web Frontend">Desarrollo Web Frontend</MenuItem>
              <MenuItem value="Bases de Datos">Bases de Datos</MenuItem>
              <MenuItem value="Algoritmos">Algoritmos</MenuItem>
              <MenuItem value="Diseño de Interfaces">Diseño de Interfaces</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl fullWidth size="small" margin="dense">
            <InputLabel>Calificación mínima</InputLabel>
            <Select
              name="rating"
              value={filters.rating}
              onChange={handleFilterChange}
              label="Calificación mínima"
            >
              <MenuItem value={0}>Cualquiera</MenuItem>
              <MenuItem value={3}>3+ estrellas</MenuItem>
              <MenuItem value={4}>4+ estrellas</MenuItem>
              <MenuItem value={5}>5 estrellas</MenuItem>
            </Select>
          </FormControl>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button 
              size="small" 
              onClick={resetFilters}
              sx={{ mr: 1 }}
            >
              Limpiar
            </Button>
            <Button 
              size="small" 
              variant="contained" 
              color="primary"
              onClick={applyFilters}
            >
              Aplicar
            </Button>
          </Box>
        </Box>
      </Menu>
      
      {/* Resource Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={handleDetailsClose}
        maxWidth="md"
        fullWidth
      >
        {selectedResource && (
          <>
            <DialogTitle>
              {selectedResource.title}
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Typography variant="h6" gutterBottom>
                    Descripción
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {selectedResource.description}
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
                            <strong>Materia:</strong> {selectedResource.subject}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <DescriptionOutlined fontSize="small" color="action" sx={{ mr: 1 }} />
                          <Typography variant="body1">
                            <strong>Tipo:</strong> {selectedResource.type === 'DOCUMENT' ? 'Documento' : 'Video'}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <GetApp fontSize="small" color="action" sx={{ mr: 1 }} />
                          <Typography variant="body1">
                            <strong>Descargas:</strong> {selectedResource.downloads}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Person fontSize="small" color="action" sx={{ mr: 1 }} />
                          <Typography variant="body1">
                            <strong>Creado por:</strong> {
                              selectedResource.createdBy === 1 ? 'Ana García' :
                              selectedResource.createdBy === 2 ? 'Carlos Mendoza' :
                              selectedResource.createdBy === 5 ? 'Sofia Ramírez' : 'Usuario desconocido'
                            }
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                  
                  <Typography variant="h6" gutterBottom>
                    Temas
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    {selectedResource.topics.map((topic, index) => (
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
                    {selectedResource.type === 'DOCUMENT' ? (
                      <DescriptionOutlined sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                    ) : (
                      <OpenInNew sx={{ fontSize: 64, color: 'secondary.main', mb: 2 }} />
                    )}
                    
                    <Button 
                      variant="contained" 
                      color="primary" 
                      fullWidth
                      startIcon={<CloudDownload />}
                      component="a"
                      href={selectedResource.url}
                      target="_blank"
                      sx={{ mb: 1 }}
                    >
                      Descargar Recurso
                    </Button>
                    
                    <Button 
                      variant="outlined"
                      fullWidth
                      startIcon={savedResources.includes(selectedResource.id) ? <Bookmark /> : <BookmarkBorder />}
                      onClick={() => toggleSaveResource(selectedResource.id)}
                      sx={{ mb: 1 }}
                      color={savedResources.includes(selectedResource.id) ? "primary" : "inherit"}
                    >
                      {savedResources.includes(selectedResource.id) ? 'Guardado' : 'Guardar'}
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
                      <Rating value={selectedResource.averageRating} precision={0.1} readOnly />
                      <Typography variant="body2" color="text.secondary">
                        {selectedResource.averageRating} de 5 ({selectedResource.ratings.length} reseñas)
                      </Typography>
                    </Box>
                    <Button 
                      variant="text" 
                      startIcon={<StarOutline />}
                      size="small"
                    >
                      Calificar
                    </Button>
                  </Box>
                  
                  <List sx={{ p: 0 }}>
                    {selectedResource.ratings.map((rating, index) => (
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
                                {rating.userId === 1 ? 'Ana García' :
                                 rating.userId === 2 ? 'Carlos Mendoza' :
                                 rating.userId === 3 ? 'Laura Jiménez' :
                                 rating.userId === 4 ? 'Miguel Torres' : 'Sofia Ramírez'}
                              </Typography>
                              <Rating value={rating.score} size="small" readOnly />
                            </Box>
                          }
                          secondary={rating.comment}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDetailsClose}>
                Cerrar
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default Resources;