import { supabase } from './supabase';

export const signUp = async (email, password, userData) => {
  // Check if user already exists
  const { data: existingUser } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('emailid', email)
    .single();

  if (existingUser) {
    return { data: null, error: { message: 'User already exists' } };
  }

  // Create user profile
  const { data, error } = await supabase
    .from('user_profiles')
    .insert([{
      user_name: userData.name,
      emailid: email,
      password: password, // In production, hash this
      birthdate: userData.birthdate
    }])
    .select()
    .single();

  return { data, error };
};

export const signIn = async (email, password) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('emailid', email)
    .eq('password', password)
    .single();

  if (error || !data) {
    return { data: null, error: { message: 'Invalid credentials' } };
  }

  return { data, error: null };
};

export const signOut = async () => {
  // Just clear local storage or state
  return { error: null };
};

export const getCurrentUser = () => {
  // Return stored user from localStorage or state
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};