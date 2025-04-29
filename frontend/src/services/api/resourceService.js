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

// Add a new resource
export const addResource = async (resourceData) => {
  await delay(800); // Simulate a longer delay for resource upload
  
  const newResource = {
    id: MOCK_RESOURCES.length + 1,
    title: resourceData.title,
    description: resourceData.description,
    type: resourceData.resourceType,
    subject: resourceData.subject,
    topics: resourceData.topics,
    url: resourceData.url,
    createdBy: resourceData.createdBy,
    ratings: [],
    averageRating: 0,
    downloads: 0,
    createdAt: new Date().toISOString(),
  };
  
  // Add to mock data (in a real app this would be handled by the backend)
  MOCK_RESOURCES.unshift(newResource);
  
  return newResource;
};

// Update a resource
export const updateResource = async (resourceId, resourceData) => {
  await delay(600);
  
  const resourceIndex = MOCK_RESOURCES.findIndex(r => r.id === parseInt(resourceId));
  
  if (resourceIndex === -1) {
    throw new Error('Recurso no encontrado');
  }
  
  // Update resource data
  const updatedResource = {
    ...MOCK_RESOURCES[resourceIndex],
    ...resourceData,
    updatedAt: new Date().toISOString()
  };
  
  // Replace in mock data
  MOCK_RESOURCES[resourceIndex] = updatedResource;
  
  return updatedResource;
};

// Delete a resource
export const deleteResource = async (resourceId) => {
  await delay(500);
  
  const resourceIndex = MOCK_RESOURCES.findIndex(r => r.id === parseInt(resourceId));
  
  if (resourceIndex === -1) {
    throw new Error('Recurso no encontrado');
  }
  
  // Remove from mock data
  MOCK_RESOURCES.splice(resourceIndex, 1);
  
  return { success: true };
};

// Rate a resource
export const rateResource = async (resourceId, userId, rating, comment) => {
  await delay(400);
  
  const resourceIndex = MOCK_RESOURCES.findIndex(r => r.id === parseInt(resourceId));
  
  if (resourceIndex === -1) {
    throw new Error('Recurso no encontrado');
  }
  
  const resource = MOCK_RESOURCES[resourceIndex];
  
  // Check if user has already rated this resource
  const existingRatingIndex = resource.ratings.findIndex(r => r.userId === userId);
  
  if (existingRatingIndex !== -1) {
    // Update existing rating
    resource.ratings[existingRatingIndex] = {
      userId,
      score: rating,
      comment
    };
  } else {
    // Add new rating
    resource.ratings.push({
      userId,
      score: rating,
      comment
    });
  }
  
  // Recalculate average rating
  const totalRating = resource.ratings.reduce((sum, r) => sum + r.score, 0);
  resource.averageRating = totalRating / resource.ratings.length;
  
  return resource;
};

// Track a download
export const trackDownload = async (resourceId) => {
  await delay(300);
  
  const resourceIndex = MOCK_RESOURCES.findIndex(r => r.id === parseInt(resourceId));
  
  if (resourceIndex === -1) {
    throw new Error('Recurso no encontrado');
  }
  
  // Increment download count
  MOCK_RESOURCES[resourceIndex].downloads += 1;
  
  return MOCK_RESOURCES[resourceIndex];
};
