import { MOCK_RESOURCES } from '../mockData';

// Simular delay para emular peticiones a API
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Get all resources
export const getResources = async () => {
  await delay(500);
  return MOCK_RESOURCES;
};

// Get resource by ID
export const getResourceById = async (resourceId) => {
  await delay(300);
  const resource = MOCK_RESOURCES.find(r => r.id === parseInt(resourceId));
  
  if (!resource) {
    throw new Error('Recurso no encontrado');
  }
  
  return resource;
};

// Get resources by subject
export const getResourcesBySubject = async (subject) => {
  await delay(400);
  return MOCK_RESOURCES.filter(r => r.subject === subject);
};

// Get resources by topic
export const getResourcesByTopic = async (topic) => {
  await delay(400);
  return MOCK_RESOURCES.filter(r => r.topics.includes(topic));
};

// Get top rated resources
export const getTopRatedResources = async (limit = 5) => {
  await delay(400);
  
  // Ordenamos por rating promedio y luego filtramos por límite
  const sortedResources = [...MOCK_RESOURCES].sort((a, b) => b.averageRating - a.averageRating);
  
  return sortedResources.slice(0, limit);
};

// Get most downloaded resources
export const getMostDownloadedResources = async (limit = 5) => {
  await delay(400);
  
  // Ordenamos por número de descargas y luego filtramos por límite
  const sortedResources = [...MOCK_RESOURCES].sort((a, b) => b.downloads - a.downloads);
  
  return sortedResources.slice(0, limit);
};