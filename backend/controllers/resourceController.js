const { supabase } = require('../config/supabase');

exports.getResources = async (req, res) => {
  res.status(200).json({ message: 'Get resources endpoint' });
};

exports.createResource = async (req, res) => {
  res.status(200).json({ message: 'Create resource endpoint' });
};

exports.getResourceById = async (req, res) => {
  res.status(200).json({ message: 'Get resource by ID endpoint' });
};