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
  return MOCK_MENTORSHIPS.filter(m => m.tutorId === parseInt(mentorId));
};

// Get mentorships by mentee ID
export const getMentorshipsByMenteeId = async (menteeId) => {
  await delay(400);
  return MOCK_MENTORSHIPS.filter(m => m.tutoradoId === parseInt(menteeId));
};

// Get sessions by mentorship ID
export const getSessionsByMentorshipId = async (mentorshipId) => {
  await delay(400);
  return MOCK_SESSIONS.filter(s => s.tutoriaId === parseInt(mentorshipId));
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

// Create a new session
export const createSession = async (sessionData) => {
  await delay(800); // Simulate a longer delay for session creation
  
  const newSession = {
    id: MOCK_SESSIONS.length + 1,
    tutoriaId: sessionData.mentorshipId,
    title: sessionData.title,
    date: sessionData.date,
    startTime: sessionData.startTime,
    endTime: sessionData.endTime,
    mode: sessionData.mode,
    location: sessionData.location,
    status: sessionData.status || 'SCHEDULED',
    topics: sessionData.topics || [],
    resources: [],
    notes: sessionData.notes || '',
    feedback: null
  };
  
  // Add to mock data
  MOCK_SESSIONS.push(newSession);
  
  return newSession;
};

// Update a session
export const updateSession = async (sessionId, sessionData) => {
  await delay(500);
  
  const sessionIndex = MOCK_SESSIONS.findIndex(s => s.id === parseInt(sessionId));
  
  if (sessionIndex === -1) {
    throw new Error('Sesión no encontrada');
  }
  
  // Update session data
  const updatedSession = {
    ...MOCK_SESSIONS[sessionIndex],
    ...sessionData
  };
  
  // Replace in mock data
  MOCK_SESSIONS[sessionIndex] = updatedSession;
  
  return updatedSession;
};

// Cancel a session
export const cancelSession = async (sessionId, reason) => {
  await delay(400);
  
  const sessionIndex = MOCK_SESSIONS.findIndex(s => s.id === parseInt(sessionId));
  
  if (sessionIndex === -1) {
    throw new Error('Sesión no encontrada');
  }
  
  // Update status to CANCELED
  MOCK_SESSIONS[sessionIndex].status = 'CANCELED';
  MOCK_SESSIONS[sessionIndex].cancellationReason = reason || '';
  
  return MOCK_SESSIONS[sessionIndex];
};

// Complete a session
export const completeSession = async (sessionId, notes) => {
  await delay(400);
  
  const sessionIndex = MOCK_SESSIONS.findIndex(s => s.id === parseInt(sessionId));
  
  if (sessionIndex === -1) {
    throw new Error('Sesión no encontrada');
  }
  
  // Update status to COMPLETED
  MOCK_SESSIONS[sessionIndex].status = 'COMPLETED';
  
  if (notes) {
    MOCK_SESSIONS[sessionIndex].notes = notes;
  }
  
  return MOCK_SESSIONS[sessionIndex];
};

// Add feedback to a session
export const addSessionFeedback = async (sessionId, userType, feedback) => {
  await delay(500);
  
  const sessionIndex = MOCK_SESSIONS.findIndex(s => s.id === parseInt(sessionId));
  
  if (sessionIndex === -1) {
    throw new Error('Sesión no encontrada');
  }
  
  // Initialize feedback object if it doesn't exist
  if (!MOCK_SESSIONS[sessionIndex].feedback) {
    MOCK_SESSIONS[sessionIndex].feedback = {};
  }
  
  // Add feedback based on user type (tutor or tutorado)
  MOCK_SESSIONS[sessionIndex].feedback[userType] = feedback;
  
  return MOCK_SESSIONS[sessionIndex];
};

// Create a new mentorship
export const createMentorship = async (mentorshipData) => {
  await delay(800);
  
  const newMentorship = {
    id: MOCK_MENTORSHIPS.length + 1,
    tutorId: mentorshipData.tutorId,
    tutoradoId: mentorshipData.tutoradoId,
    status: 'ACTIVE',
    startDate: new Date().toISOString().split('T')[0],
    endDate: null,
    focusAreas: mentorshipData.focusAreas || [],
    notes: mentorshipData.notes || '',
    tutorRating: null,
    tutoradoRating: null
  };
  
  // Add to mock data
  MOCK_MENTORSHIPS.push(newMentorship);
  
  return newMentorship;
};

// End a mentorship
export const endMentorship = async (mentorshipId, reason) => {
  await delay(500);
  
  const mentorshipIndex = MOCK_MENTORSHIPS.findIndex(m => m.id === parseInt(mentorshipId));
  
  if (mentorshipIndex === -1) {
    throw new Error('Mentoría no encontrada');
  }
  
  // Update status and end date
  MOCK_MENTORSHIPS[mentorshipIndex].status = 'COMPLETE';
  MOCK_MENTORSHIPS[mentorshipIndex].endDate = new Date().toISOString().split('T')[0];
  MOCK_MENTORSHIPS[mentorshipIndex].endReason = reason || '';
  
  return MOCK_MENTORSHIPS[mentorshipIndex];
};

// Rate a mentorship
export const rateMentorship = async (mentorshipId, userType, rating) => {
  await delay(400);
  
  const mentorshipIndex = MOCK_MENTORSHIPS.findIndex(m => m.id === parseInt(mentorshipId));
  
  if (mentorshipIndex === -1) {
    throw new Error('Mentoría no encontrada');
  }
  
  // Update rating based on user type (tutor or tutorado)
  if (userType === 'tutor') {
    MOCK_MENTORSHIPS[mentorshipIndex].tutoradoRating = rating;
  } else {
    MOCK_MENTORSHIPS[mentorshipIndex].tutorRating = rating;
  }
  
  return MOCK_MENTORSHIPS[mentorshipIndex];
};
