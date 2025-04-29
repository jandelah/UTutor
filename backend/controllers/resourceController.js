// controllers/resourceController.js
const { supabase } = require('../config/supabase');

exports.getResources = async (req, res) => {
  try {
    const { subject, type } = req.query;
    
    let query = supabase
      .from('resources')
      .select(`
        *,
        creator:created_by(id, name, avatar_url),
        resource_ratings(score)
      `);
    
    if (subject) {
      query = query.eq('subject', subject);
    }
    
    if (type) {
      query = query.eq('type', type);
    }
    
    // Order by created_at
    query = query.order('created_at', { ascending: false });
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Calculate average rating for each resource
    const enhancedData = data.map(resource => {
      let avgRating = 0;
      
      if (resource.resource_ratings && resource.resource_ratings.length > 0) {
        const sum = resource.resource_ratings.reduce((acc, rating) => acc + rating.score, 0);
        avgRating = sum / resource.resource_ratings.length;
      }
      
      return {
        ...resource,
        avg_rating: avgRating
      };
    });
    
    res.status(200).json({
      success: true,
      data: enhancedData
    });
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.createResource = async (req, res) => {
  try {
    const { title, description, type, subject, url } = req.body;
    const userId = req.user.id;
    
    const { data, error } = await supabase
      .from('resources')
      .insert([
        {
          title,
          description,
          type,
          subject,
          url,
          created_by: userId,
          downloads: 0
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
    console.error('Error creating resource:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getResourceById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('resources')
      .select(`
        *,
        creator:created_by(id, name, avatar_url),
        resource_ratings(score, comment, user_id)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }
    
    // Calculate average rating
    let avgRating = 0;
    
    if (data.resource_ratings && data.resource_ratings.length > 0) {
      const sum = data.resource_ratings.reduce((acc, rating) => acc + rating.score, 0);
      avgRating = sum / data.resource_ratings.length;
    }
    
    // Increment download counter
    await supabase
      .from('resources')
      .update({ downloads: data.downloads + 1 })
      .eq('id', id);
    
    res.status(200).json({
      success: true,
      data: {
        ...data,
        avg_rating: avgRating
      }
    });
  } catch (error) {
    console.error('Error fetching resource:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Add rate, update, and delete operations
exports.updateResource = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, type, subject, url } = req.body;
    const userId = req.user.id;
    
    // Check if resource exists and user is the creator
    const { data: resource, error: resourceError } = await supabase
      .from('resources')
      .select('*')
      .eq('id', id)
      .eq('created_by', userId)
      .single();
    
    if (resourceError || !resource) {
      return res.status(403).json({
        success: false,
        message: 'Resource not found or you do not have permission to update it'
      });
    }
    
    const { data, error } = await supabase
      .from('resources')
      .update({
        title,
        description,
        type,
        subject,
        url,
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
    console.error('Error updating resource:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteResource = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Check if resource exists and user is the creator
    const { data: resource, error: resourceError } = await supabase
      .from('resources')
      .select('*')
      .eq('id', id)
      .eq('created_by', userId)
      .single();
    
    if (resourceError || !resource) {
      return res.status(403).json({
        success: false,
        message: 'Resource not found or you do not have permission to delete it'
      });
    }
    
    // Delete the resource
    const { error: deleteError } = await supabase
      .from('resources')
      .delete()
      .eq('id', id);
    
    if (deleteError) throw deleteError;
    
    res.status(200).json({
      success: true,
      message: 'Resource deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting resource:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.rateResource = async (req, res) => {
  try {
    const { id } = req.params;
    const { score, comment } = req.body;
    const userId = req.user.id;
    
    // Check if the resource exists
    const { data: resource, error: resourceError } = await supabase
      .from('resources')
      .select('*')
      .eq('id', id)
      .single();
    
    if (resourceError || !resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }
    
    // Check if user already rated this resource
    const { data: existingRating, error: checkError } = await supabase
      .from('resource_ratings')
      .select('*')
      .eq('resource_id', id)
      .eq('user_id', userId)
      .single();
    
    let ratingData;
    
    if (existingRating) {
      // Update existing rating
      const { data, error } = await supabase
        .from('resource_ratings')
        .update({
          score,
          comment,
          created_at: new Date()
        })
        .eq('id', existingRating.id)
        .select()
        .single();
      
      if (error) throw error;
      ratingData = data;
    } else {
      // Create new rating
      const { data, error } = await supabase
        .from('resource_ratings')
        .insert([
          {
            resource_id: id,
            user_id: userId,
            score,
            comment
          }
        ])
        .select()
        .single();
      
      if (error) throw error;
      ratingData = data;
    }
    
    res.status(201).json({
      success: true,
      data: ratingData
    });
  } catch (error) {
    console.error('Error rating resource:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};