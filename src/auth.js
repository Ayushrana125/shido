import { supabase } from './supabase';

export const signUp = async (email, password, userData) => {
  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) return { data: null, error: authError };

  // Create user profile
  const { data: profileData, error: profileError } = await supabase
    .from('User_Profiles')
    .insert([{
      user_id: authData.user.id,
      user_name: userData.name,
      emailid: email,
      birthdate: userData.birthdate
    }]);

  return { data: authData, error: profileError };
};

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = () => {
  return supabase.auth.getUser();
};