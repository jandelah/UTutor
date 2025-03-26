import { MOCK_MENTORSHIPS, MOCK_SESSIONS } from '../mockData';

// Simular delay para emular peticiones a API
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Get all mentorships
export const getMentorships = async () => {
  await delay(500);
  return MOCK_MENTORSHIPS;
};

// Get mentorship by ID
export const getMentorshipById = async (mentorshipId) => {
  await delay(300);
  const mentorship = MOCK_MENTORSHIPS.find(m => m.id === parseInt(mentorshipId));
  
  if (!mentorship) {
    throw new Error('Mentoría no encontrada');
  }
  
  return mentorship;
};

// Get mentorships by mentor ID
export const getMentorshipsByMentorId = async (mentorId) => {
  await delay(400);
  return MOCK_MENTORSHIPS.filter(m => m.mentorId === parseInt(mentorId));
};

// Get mentorships by mentee ID
export const getMentorshipsByMenteeId = async (menteeId) => {
  await delay(400);
  return MOCK_MENTORSHIPS.filter(m => m.menteeId === parseInt(menteeId));
};

// Get sessions by mentorship ID
export const getSessionsByMentorshipId = async (mentorshipId) => {
  await delay(400);
  return MOCK_SESSIONS.filter(s => s.mentorshipId === parseInt(mentorshipId));
};

// Get session by ID
export const getSessionById = async (sessionId) => {
  await delay(300);
  const session = MOCK_SESSIONS.find(s => s.id === parseInt(sessionId));
  
  if (!session) {
    throw new Error('Sesión no encontrada');
  }
  
  return session;
};

// Get upcoming sessions
export const getUpcomingSessions = async () => {
  await delay(500);
  
  // Filtramos las sesiones programadas y las ordenamos por fecha
  const upcomingSessions = MOCK_SESSIONS.filter(s => s.status === 'SCHEDULED');
  
  return upcomingSessions.sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.startTime}`);
    const dateB = new Date(`${b.date}T${b.startTime}`);
    return dateA - dateB;
  });
};

// Get completed sessions
export const getCompletedSessions = async () => {
  await delay(500);
  
  // Filtramos las sesiones completadas y las ordenamos por fecha (más recientes primero)
  const completedSessions = MOCK_SESSIONS.filter(s => s.status === 'COMPLETED');
  
  return completedSessions.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA;
  });
};