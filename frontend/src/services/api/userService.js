import { MOCK_USERS, MOCK_MENTOR_PROFILES, MOCK_MENTEE_PROFILES } from '../mockData';

// Simular delay para emular peticiones a API
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Get all users
export const getUsers = async () => {
  await delay(500);
  return MOCK_USERS;
};

// Get user by ID
export const getUserById = async (userId) => {
  await delay(300);
  const user = MOCK_USERS.find(user => user.id === parseInt(userId));
  
  if (!user) {
    throw new Error('Usuario no encontrado');
  }
  
  return user;
};

// Get mentor profile by user ID
export const getMentorProfileByUserId = async (userId) => {
  await delay(400);
  const profile = MOCK_MENTOR_PROFILES.find(profile => profile.userId === parseInt(userId));
  
  if (!profile) {
    throw new Error('Perfil de mentor no encontrado');
  }
  
  return profile;
};

// Get mentee profile by user ID
export const getMenteeProfileByUserId = async (userId) => {
  await delay(400);
  const profile = MOCK_MENTEE_PROFILES.find(profile => profile.userId === parseInt(userId));
  
  if (!profile) {
    throw new Error('Perfil de mentee no encontrado');
  }
  
  return profile;
};

// Get all mentors with their profiles
export const getMentorsWithProfiles = async () => {
  await delay(600);
  const mentors = MOCK_USERS.filter(user => user.role === 'MENTOR');
  
  return Promise.all(mentors.map(async mentor => {
    const profile = await getMentorProfileByUserId(mentor.id).catch(() => null);
    return { ...mentor, profile };
  }));
};

// Get all mentees with their profiles
export const getMenteesWithProfiles = async () => {
  await delay(600);
  const mentees = MOCK_USERS.filter(user => user.role === 'MENTEE');
  
  return Promise.all(mentees.map(async mentee => {
    const profile = await getMenteeProfileByUserId(mentee.id).catch(() => null);
    return { ...mentee, profile };
  }));
};

// Mock login (simplemente verifica si el email existe)
export const loginUser = async (email, password) => {
  await delay(800);
  const user = MOCK_USERS.find(user => user.email === email);
  
  if (!user) {
    throw new Error('Credenciales inválidas');
  }
  
  // En un caso real, esta función verificaría la contraseña con el backend
  return {
    user,
    token: 'mock-jwt-token-' + Date.now()
  };
};