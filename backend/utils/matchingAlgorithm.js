// utils/matchingAlgorithm.js
const { supabase } = require('../config/supabase');

// Find matching mentors based on subjects and availability
exports.findMatchingMentors = async (menteeId, subjectId) => {
  try {
    // Get mentee profile
    const { data: mentee, error: menteeError } = await supabase
      .from('mentee_profiles')
      .select(`
        *,
        user:user_id(*),
        interest_areas(*)
      `)
      .eq('id', menteeId)
      .single();
    
    if (menteeError) throw menteeError;
    
    // Find mentors who teach the requested subject
    const { data: mentors, error: mentorsError } = await supabase
      .from('mentor_profiles')
      .select(`
        *,
        user:user_id(*),
        expertise_areas(*),
        subjects(*),
        availability(*)
      `)
      .eq('subjects.id', subjectId);
    
    if (mentorsError) throw mentorsError;
    
    // Calculate match score for each mentor
    const scoredMentors = mentors.map(mentor => {
      let score = 0;
      
      // Check if mentor teaches subjects in mentee's interest areas
      mentee.interest_areas.forEach(interest => {
        mentor.expertise_areas.forEach(expertise => {
          if (interest.area.toLowerCase() === expertise.area.toLowerCase()) {
            score += 2;
          }
        });
      });
      
      // Add points for mentor rating
      score += mentor.rating || 0;
      
      // Add points for completed sessions (experience)
      score += Math.min((mentor.completed_sessions || 0) / 5, 2);
      
      return {
        ...mentor,
        match_score: score
      };
    });
    
    // Sort by match score (descending)
    scoredMentors.sort((a, b) => b.match_score - a.match_score);
    
    return scoredMentors;
  } catch (error) {
    console.error('Error in matching algorithm:', error);
    throw error;
  }
};