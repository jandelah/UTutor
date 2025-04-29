// src/services/api/mentorshipService.js

import apiClient from './apiClient';

// Get all mentorships
export const getMentorships = async () => {
  try {
    const response = await apiClient.get('/mentorships');
    return response.data;
  } catch (error) {
    console.error('Error fetching mentorships:', error);
    throw error;
  }
};

// Get mentorship by ID
export const getMentorshipById = async (mentorshipId) => {
  try {
    const response = await apiClient.get(`/mentorships/${mentorshipId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching mentorship:', error);
    throw error;
  }
};

// Create a new mentorship
export const createMentorship = async (mentorshipData) => {
  try {
    const response = await apiClient.post('/mentorships', mentorshipData);
    return response.data;
  } catch (error) {
    console.error('Error creating mentorship:', error);
    throw error;
  }
};

// Update a mentorship
export const updateMentorship = async (mentorshipId, mentorshipData) => {
  try {
    const response = await apiClient.put(`/mentorships/${mentorshipId}`, mentorshipData);
    return response.data;
  } catch (error) {
    console.error('Error updating mentorship:', error);
    throw error;
  }
};

// Delete a mentorship
export const deleteMentorship = async (mentorshipId) => {
  try {
    const response = await apiClient.delete(`/mentorships/${mentorshipId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting mentorship:', error);
    throw error;
  }
};

// Get upcoming sessions
export const getUpcomingSessions = async () => {
  try {
    const response = await apiClient.get('/sessions?status=SCHEDULED');
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching upcoming sessions:', error);
    throw error;
  }
};

// Get completed sessions
export const getCompletedSessions = async () => {
  try {
    const response = await apiClient.get('/sessions?status=COMPLETED');
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching completed sessions:', error);
    throw error;
  }
};