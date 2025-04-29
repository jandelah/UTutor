// controllers/sessionController.js
const { supabase } = require('../config/supabase');

exports.getSessions = async (req, res) => {
  try {
    const userId = req.user.id;
    const { mentorship_id } = req.query;
    
    let query = supabase
  .from('sessions')
  .select(`
    *,
    mentorship:mentorship_id(
      id,
      tutor_id,
      tutorado_id
    )
  `);

// Use separate filters instead of a complex OR condition
if (userId) {
  // First find sessions where user is the tutor
  const tutorQuery = supabase
    .from('sessions')
    .select(`
      *,
      mentorship:mentorship_id(
        id,
        tutor_id,
        tutorado_id
      )
    `)
    .eq('mentorship.tutor_id', userId);
  
  // Then find sessions where user is the tutorado
  const tutoradoQuery = supabase
    .from('sessions')
    .select(`
      *,
      mentorship:mentorship_id(
        id,
        tutor_id,
        tutorado_id
      )
    `)
    .eq('mentorship.tutorado_id', userId);
  
  // Execute both queries and combine the results
  const [tutorResult, tutoradoResult] = await Promise.all([tutorQuery, tutoradoQuery]);
  const combinedResults = [...(tutorResult.data || []), ...(tutoradoResult.data || [])];
  
  // Use the combined results
  query = { data: combinedResults, error: tutorResult.error || tutoradoResult.error };
}
    
    // Order by date
    query = query.order('date', { ascending: true });
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.createSession = async (req, res) => {
  try {
    const {
      mentorship_id,
      date,
      start_time,
      end_time,
      title,
      mode,
      location,
      notes
    } = req.body;
    
    // Verify user has access to the mentorship
    const userId = req.user.id;
    const { data: mentorship, error: mentorshipError } = await supabase
      .from('mentorships')
      .select('*')
      .eq('id', mentorship_id)
      .or(`tutor_id.eq.${userId},tutorado_id.eq.${userId}`)
      .single();
    
    if (mentorshipError || !mentorship) {
      return res.status(403).json({
        success: false,
        message: 'Mentorship not found or you do not have access'
      });
    }
    
    const { data, error } = await supabase
      .from('sessions')
      .insert([
        {
          mentorship_id,
          date,
          start_time,
          end_time,
          title,
          mode,
          location,
          notes,
          status: 'SCHEDULED'
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
    console.error('Error creating session:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getSessionById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('sessions')
      .select(`
        *,
        mentorship:mentorship_id(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Add update and delete operations
exports.updateSession = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      date, 
      start_time, 
      end_time, 
      title, 
      mode, 
      location, 
      notes, 
      status 
    } = req.body;
    
    const userId = req.user.id;
    
    // Verify session exists and user has access
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select(`
        *,
        mentorship:mentorship_id(tutor_id, tutorado_id)
      `)
      .eq('id', id)
      .single();
    
    if (sessionError || !session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }
    
    // Check if user has access to this session
    if (session.mentorship.tutor_id !== userId && session.mentorship.tutorado_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this session'
      });
    }
    
    // Update session
    const { data, error } = await supabase
      .from('sessions')
      .update({
        date,
        start_time,
        end_time,
        title,
        mode,
        location,
        notes,
        status,
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
    console.error('Error updating session:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteSession = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Verify session exists and user has access
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select(`
        *,
        mentorship:mentorship_id(tutor_id, tutorado_id)
      `)
      .eq('id', id)
      .single();
    
    if (sessionError || !session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }
    
    // Check if user has access to this session
    if (session.mentorship.tutor_id !== userId && session.mentorship.tutorado_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this session'
      });
    }
    
    // Delete the session
    const { error: deleteError } = await supabase
      .from('sessions')
      .delete()
      .eq('id', id);
    
    if (deleteError) throw deleteError;
    
    res.status(200).json({
      success: true,
      message: 'Session deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};