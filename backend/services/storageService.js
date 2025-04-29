// services/storageService.js
const { supabase } = require('../config/supabase');

// Upload profile image
exports.uploadProfileImage = async (userId, file) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `profiles/${fileName}`;
    
    const { error } = await supabase.storage
      .from('profile-images')
      .upload(filePath, file.data, {
        contentType: file.mimetype
      });
    
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('profile-images')
      .getPublicUrl(filePath);
    
    return publicUrl;
  } catch (error) {
    console.error('Error uploading profile image:', error);
    throw error;
  }
};

// Upload resource file
exports.uploadResourceFile = async (userId, file) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `resources/${fileName}`;
    
    const { error } = await supabase.storage
      .from('resource-files')
      .upload(filePath, file.data, {
        contentType: file.mimetype
      });
    
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('resource-files')
      .getPublicUrl(filePath);
    
    return publicUrl;
  } catch (error) {
    console.error('Error uploading resource file:', error);
    throw error;
  }
};