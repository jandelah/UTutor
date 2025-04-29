// controllers/mentorshipController.js
const { supabase } = require('../config/supabase');

exports.getMentorships = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const { data, error } = await supabase
      .from('mentorships')
      .select(`
        *,
        tutor:tutor_id(*),
        tutorado:tutorado_id(*)
      `)
      .or(`tutor_id.eq.${userId},tutorado_id.eq.${userId}`);
    
    if (error) throw error;
    
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching mentorships:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.createMentorship = async (req, res) => {
  try {
    const {
      tutor_id,
      tutorado_id,
      start_date,
      end_date,
      notes
    } = req.body;
    
    const { data, error } = await supabase
      .from('mentorships')
      .insert([
        {
          tutor_id,
          tutorado_id,
          start_date,
          end_date,
          notes,
          status: 'ACTIVE'
        }
      ])
      .select()
      .single();
    
    if (error) throw error;
    
    res.status(201).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error creating mentorship:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getMentorshipById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('mentorships')
      .select(`
        *,
        tutor:tutor_id(*),
        tutorado:tutorado_id(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Mentorship not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching mentorship:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Add update and delete operations
exports.updateMentorship = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      end_date, 
      status, 
      notes, 
      tutor_rating, 
      tutorado_rating 
    } = req.body;
    
    // Check if mentorship exists and user has access
    const userId = req.user.id;
    const { data: existingMentorship, error: checkError } = await supabase
      .from('mentorships')
      .select('*')
      .eq('id', id)
      .or(`tutor_id.eq.${userId},tutorado_id.eq.${userId}`)
      .single();
    
    if (checkError || !existingMentorship) {
      return res.status(404).json({
        success: false,
        message: 'Mentorship not found or you do not have access'
      });
    }
    
    // Update mentorship
    const { data, error } = await supabase
      .from('mentorships')
      .update({
        end_date,
        status,
        notes,
        tutor_rating,
        tutorado_rating,
        updated_at: new Date()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error updating mentorship:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteMentorship = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Check if mentorship exists and user has access
    const { data: existingMentorship, error: checkError } = await supabase
      .from('mentorships')
      .select('*')
      .eq('id', id)
      .or(`tutor_id.eq.${userId},tutorado_id.eq.${userId}`)
      .single();
    
    if (checkError || !existingMentorship) {
      return res.status(404).json({
        success: false,
        message: 'Mentorship not found or you do not have access'
      });
    }
    
    // Delete the mentorship
    const { error: deleteError } = await supabase
      .from('mentorships')
      .delete()
      .eq('id', id);
    
    if (deleteError) throw deleteError;
    
    res.status(200).json({
      success: true,
      message: 'Mentorship deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting mentorship:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};