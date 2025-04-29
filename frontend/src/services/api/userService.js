// src/services/api/userService.js

import apiClient from './apiClient';

// Get all users
export const getUsers = async () => {
  try {
    const response = await apiClient.get('/users');
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Get user by ID
export const getUserById = async (userId) => {
  try {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

// Get current user's profile
export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get('/users/me');
    return response.data.user;
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
};

// Get mentors (users with role TUTOR)
export const getMentors = async () => {
  try {
    // This endpoint might need to be adjusted based on your actual API
    // It assumes there's a way to filter users by role
    const response = await apiClient.get('/users?role=TUTOR');
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching mentors:', error);
    throw error;
  }
};

// Get mentees (users with role TUTORADO)
export const getMentees = async () => {
  try {
    // Filter users who are tutorados
    const response = await apiClient.get('/users?role=TUTORADO');
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching mentees:', error);
    throw error;
  }
};

// Get mentees with their profiles
export const getMenteesWithProfiles = async () => {
  try {
    // Get mentees
    const mentees = await getMentees();
    
    // In a real implementation, you might want to fetch their profiles
    // This would depend on your API structure
    return mentees;
  } catch (error) {
    console.error('Error fetching mentees with profiles:', error);
    throw error;
  }
};
// Get mentor profile by user ID
export const getMentorProfileByUserId = async (userId) => {
  try {
    // This endpoint might need to be adjusted based on your actual API
    const response = await apiClient.get(`/users/${userId}/mentor-profile`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching mentor profile:', error);
    throw error;
  }
};
// Get mentee profile by user ID
export const getMenteeProfileByUserId = async (userId) => {
  try {
    // This endpoint might need to be adjusted based on your actual API
    const response = await apiClient.get(`/users/${userId}/mentee-profile`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching mentee profile:', error);
    throw error;
  }
};
