const { supabase } = require('../config/supabase');

// Register user
exports.register = async (req, res) => {
  try {
    const { email, password, name, career, semester, role } = req.body;

    // Register user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    // Create user profile in database
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([
        { 
          id: authData.user.id,
          email, 
          name, 
          career, 
          semester, 
          role 
        }
      ])
      .select()
      .single();

    if (userError) throw userError;

    // Create role-specific profile
    if (role === 'TUTOR') {
      await supabase
        .from('mentor_profiles')
        .insert([{ user_id: authData.user.id }]);
    } else {
      await supabase
        .from('mentee_profiles')
        .insert([{ user_id: authData.user.id }]);
    }

    res.status(201).json({
      success: true,
      user: userData
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Get user profile
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (userError) throw userError;

    res.status(200).json({
      success: true,
      token: data.session.access_token,
      user: userData
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user data
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError) throw userError;

    res.status(200).json({
      success: true,
      user: userData
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, avatar_url, career, semester } = req.body;

    const { data, error } = await supabase
      .from('users')
      .update({ 
        name, 
        avatar_url, 
        career, 
        semester,
        updated_at: new Date()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({
      success: true,
      user: data
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};