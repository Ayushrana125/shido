import { supabase } from './supabase';

export const uploadVisionImage = async (file, userId) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('vision-images')
    .upload(fileName, file);

  if (error) return { data: null, error };

  const { data: { publicUrl } } = supabase.storage
    .from('vision-images')
    .getPublicUrl(fileName);

  return { data: { path: fileName, url: publicUrl }, error: null };
};

export const saveVisionItem = async (userId, imageUrl, imagePath, caption) => {
  const { data, error } = await supabase
    .from('Vision_Board')
    .insert([{
      user_id: userId,
      image_url: imageUrl,
      image_path: imagePath,
      caption: caption
    }])
    .select()
    .single();

  return { data, error };
};

export const getVisionItems = async (userId) => {
  const { data, error } = await supabase
    .from('Vision_Board')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return { data, error };
};

export const deleteVisionItem = async (visionId, imagePath) => {
  // Delete from storage
  if (imagePath) {
    await supabase.storage
      .from('vision-images')
      .remove([imagePath]);
  }

  // Delete from database
  const { error } = await supabase
    .from('Vision_Board')
    .delete()
    .eq('vision_id', visionId);

  return { error };
};