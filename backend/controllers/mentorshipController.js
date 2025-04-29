const { supabase } = require('../config/supabase');

exports.getMentorships = async (req, res) => {
  res.status(200).json({ message: 'Get mentorships endpoint' });
};

exports.createMentorship = async (req, res) => {
  res.status(200).json({ message: 'Create mentorship endpoint' });
};

exports.getMentorshipById = async (req, res) => {
  res.status(200).json({ message: 'Get mentorship by ID endpoint' });
};