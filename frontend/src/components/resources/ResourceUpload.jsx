import { useState } from 'react';
import { 
  Container, Paper, Typography, Box, TextField, Button,
  FormControl, InputLabel, Select, MenuItem, Chip,
  FormHelperText, Grid, CircularProgress, Alert, Autocomplete
} from '@mui/material';
import { CloudUpload, Description, InsertDriveFile, Check } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import { addResource } from '../services/api/resourceService';
import { useAuth } from '../AuthContext';

const ResourceUpload = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [topicInput, setTopicInput] = useState('');
  
  // Available subject and topic options
  const subjects = [
    'Desarrollo Web Frontend',
    'Desarrollo Web Backend',
    'Bases de Datos',
    'Algoritmos',
    'Estructura de Datos',
    'Programación Orientada a Objetos',
    'Diseño de Interfaces',
    'Redes',
    'Matemáticas',
    'Inteligencia Artificial'
  ];
  
  const availableTopics = [
    'React', 'JavaScript', 'HTML', 'CSS', 'Node.js', 'Express', 
    'SQL', 'NoSQL', 'MongoDB', 'Java', 'Python', 'C++', 
    'Algoritmos', 'Estructura de Datos', 'Patrones de Diseño', 
    'UI/UX', 'Figma', 'Bootstrap', 'Material UI', 'Angular',
    'Vue.js', 'TypeScript', 'PHP', 'Laravel', 'REST API',
    'GraphQL', 'Git', 'GitHub', 'Docker', 'AWS', 'Azure'
  ];
  
  const validationSchema = Yup.object({
    title: Yup.string()
      .required('El título es requerido')
      .min(5, 'El título debe tener al menos 5 caracteres')
      .max(100, 'El título no debe exceder los 100 caracteres'),
    description: Yup.string()
      .required('La descripción es requerida')
      .min(10, 'La descripción debe tener al menos 10 caracteres')
      .max(500, 'La descripción no debe exceder los 500 caracteres'),
    subject: Yup.string()
      .required('La materia es requerida'),
    resourceType: Yup.string()
      .required('El tipo de recurso es requerido'),
    topics: Yup.array()
      .min(1, 'Debes seleccionar al menos un tema')
      .max(5, 'No puedes seleccionar más de 5 temas')
  });
  
  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      subject: '',
      resourceType: 'DOCUMENT',
      topics: []
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      if (!uploadedFile) {
        // Show an error and return if no file was uploaded
        formik.setFieldError('file', 'Debes subir un archivo');
        setSubmitting(false);
        return;
      }
      
      try {
        // Create resource object
        const newResource = {
          ...values,
          url: URL.createObjectURL(uploadedFile), // In a real app, we'd upload to a server
          createdBy: currentUser?.id || 1,
          fileName: uploadedFile.name
        };
        
        // Call the service to add the resource
        await addResource(newResource);
        
        // Show success message
        setUploadSuccess(true);
        
        // Reset form after 2 seconds and redirect
        setTimeout(() => {
          resetForm();
          setUploadedFile(null);
          navigate('/resources');
        }, 2000);
      } catch (error) {
        console.error('Error uploading resource:', error);
        formik.setFieldError('submit', 'Error al subir el recurso. Intenta de nuevo.');
      } finally {
        setSubmitting(false);
      }
    }
  });
  
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      // Clear any previous file error
      formik.setFieldError('file', undefined);
    }
  };
  
  const handleRemoveFile = () => {
    setUploadedFile(null);
  };
  
  const handleAddTopic = () => {
    if (topicInput && !formik.values.topics.includes(topicInput)) {
      const newTopics = [...formik.values.topics, topicInput];
      formik.setFieldValue('topics', newTopics);
      setTopicInput('');
    }
  };
  
  const handleRemoveTopic = (topic) => {
    const newTopics = formik.values.topics.filter(t => t !== topic);
    formik.setFieldValue('topics', newTopics);
  };
  
  return (
    <Container maxWidth="md">
      <PageHeader 
        title="Subir Recurso Educativo" 
        subtitle="Comparte material educativo con la comunidad UTutor"
        breadcrumbs={[
          { text: 'Recursos', link: '/resources' },
          { text: 'Subir Recurso', link: '/resources/upload' }
        ]}
      />
      
      <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
        {uploadSuccess ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Check sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              ¡Recurso subido exitosamente!
            </Typography>
            <Typography variant="body1">
              Redirigiendo a la biblioteca de recursos...
            </Typography>
          </Box>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="title"
                  name="title"
                  label="Título del Recurso"
                  variant="outlined"
                  placeholder="Ej: Guía de Introducción a React"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="description"
                  name="description"
                  label="Descripción"
                  variant="outlined"
                  placeholder="Describe brevemente de qué trata este recurso"
                  multiline
                  rows={4}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl 
                  fullWidth
                  error={formik.touched.subject && Boolean(formik.errors.subject)}
                >
                  <InputLabel id="subject-label">Materia</InputLabel>
                  <Select
                    labelId="subject-label"
                    id="subject"
                    name="subject"
                    label="Materia"
                    value={formik.values.subject}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    {subjects.map(subject => (
                      <MenuItem key={subject} value={subject}>
                        {subject}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.subject && formik.errors.subject && (
                    <FormHelperText>{formik.errors.subject}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl 
                  fullWidth
                  error={formik.touched.resourceType && Boolean(formik.errors.resourceType)}
                >
                  <InputLabel id="resource-type-label">Tipo de Recurso</InputLabel>
                  <Select
                    labelId="resource-type-label"
                    id="resourceType"
                    name="resourceType"
                    label="Tipo de Recurso"
                    value={formik.values.resourceType}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <MenuItem value="DOCUMENT">Documento</MenuItem>
                    <MenuItem value="VIDEO">Video</MenuItem>
                    <MenuItem value="LINK">Enlace</MenuItem>
                  </Select>
                  {formik.touched.resourceType && formik.errors.resourceType && (
                    <FormHelperText>{formik.errors.resourceType}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Temas Relacionados
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Autocomplete
                    freeSolo
                    id="topic-input"
                    options={availableTopics.filter(topic => !formik.values.topics.includes(topic))}
                    value={topicInput}
                    onChange={(event, newValue) => {
                      setTopicInput(newValue || '');
                    }}
                    onInputChange={(event, newInputValue) => {
                      setTopicInput(newInputValue);
                    }}
                    sx={{ flexGrow: 1, mr: 1 }}
                    renderInput={(params) => (
                      <TextField 
                        {...params} 
                        label="Añadir tema"
                        placeholder="Escribe y presiona Enter"
                        variant="outlined"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTopic();
                          }
                        }}
                      />
                    )}
                  />
                  <Button 
                    variant="contained"
                    onClick={handleAddTopic}
                  >
                    Añadir
                  </Button>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  {formik.values.topics.map(topic => (
                    <Chip
                      key={topic}
                      label={topic}
                      onDelete={() => handleRemoveTopic(topic)}
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
                </Box>
                
                {formik.touched.topics && formik.errors.topics && (
                  <FormHelperText error>{formik.errors.topics}</FormHelperText>
                )}
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Archivo
                </Typography>
                <Box 
                  sx={{ 
                    border: '2px dashed',
                    borderColor: formik.errors.file ? 'error.main' : 'primary.main',
                    borderRadius: 2,
                    p: 3,
                    textAlign: 'center',
                    backgroundColor: 'background.default',
                    mb: 2
                  }}
                >
                  {uploadedFile ? (
                    <Box>
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 2
                        }}
                      >
                        <InsertDriveFile sx={{ fontSize: 40, color: 'primary.main', mr: 1 }} />
                        <Box>
                          <Typography variant="body1">
                            {uploadedFile.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {(uploadedFile.size / 1024).toFixed(2)} KB
                          </Typography>
                        </Box>
                      </Box>
                      <Button 
                        variant="outlined" 
                        color="error"
                        onClick={handleRemoveFile}
                      >
                        Remover Archivo
                      </Button>
                    </Box>
                  ) : (
                    <>
                      <input
                        type="file"
                        id="file-upload"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                      />
                      <label htmlFor="file-upload">
                        <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                        <Typography variant="h6" gutterBottom>
                          Arrastra un archivo o haz clic aquí
                        </Typography>
                        <Button 
                          variant="contained"
                          color="primary"
                          component="span"
                        >
                          Seleccionar Archivo
                        </Button>
                      </label>
                    </>
                  )}
                </Box>
                {formik.errors.file && (
                  <FormHelperText error>{formik.errors.file}</FormHelperText>
                )}
              </Grid>
              
              {formik.errors.submit && (
                <Grid item xs={12}>
                  <Alert severity="error">
                    {formik.errors.submit}
                  </Alert>
                </Grid>
              )}
              
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button 
                    variant="outlined"
                    onClick={() => navigate('/resources')}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={formik.isSubmitting}
                    endIcon={formik.isSubmitting ? <CircularProgress size={20} /> : <CloudUpload />}
                  >
                    {formik.isSubmitting ? 'Subiendo...' : 'Subir Recurso'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        )}
      </Paper>
    </Container>
  );
};

export default ResourceUpload;
