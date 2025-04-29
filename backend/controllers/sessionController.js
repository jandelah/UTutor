const { supabase } = require('../config/supabase');

exports.getSessions = async (req, res) => {
  res.status(200).json({ message: 'Get sessions endpoint' });
};

exports.createSession = async (req, res) => {
  res.status(200).json({ message: 'Create session endpoint' });
};

exports.getSessionById = async (req, res) => {
  res.status(200).json({ message: 'Get session by ID endpoint' });
};