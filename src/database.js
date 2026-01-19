import { supabase } from './supabase';

// User Profile
export const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from('User_Profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  return { data, error };
};

export const updateProfile = async (userId, profile) => {
  const { data, error } = await supabase
    .from('User_Profiles')
    .upsert({ user_id: userId, ...profile });
  return { data, error };
};

// Habits
export const getHabits = async (userId) => {
  const { data, error } = await supabase
    .from('Habits_manager')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const createHabit = async (habit) => {
  const { data, error } = await supabase
    .from('Habits_manager')
    .insert([habit]);
  return { data, error };
};

export const updateHabit = async (id, habit) => {
  const { data, error } = await supabase
    .from('Habits_manager')
    .update(habit)
    .eq('habit_id', id);
  return { data, error };
};

export const deleteHabit = async (id) => {
  const { data, error } = await supabase
    .from('Habits_manager')
    .update({ is_active: false })
    .eq('habit_id', id);
  return { data, error };
};

// Goals
export const getGoals = async (userId) => {
  const { data, error } = await supabase
    .from('Goals_Data')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const createGoal = async (goal) => {
  const { data, error } = await supabase
    .from('Goals_Data')
    .insert([goal]);
  return { data, error };
};

// Action Logs
export const getActionLogs = async (userId) => {
  const { data, error } = await supabase
    .from('Check_mark_habit_logs')
    .select('*')
    .eq('user_id', userId)
    .order('log_time', { ascending: false });
  return { data, error };
};

export const createActionLog = async (actionLog) => {
  const { data, error } = await supabase
    .from('Check_mark_habit_logs')
    .insert([actionLog]);
  return { data, error };
};

// Daily Scores
export const getDailyScores = async (userId) => {
  const { data, error } = await supabase
    .from('Daily_scores')
    .select('*')
    .eq('user_id', userId)
    .order('log_date', { ascending: false });
  return { data, error };
};

export const upsertDailyScore = async (userId, date, score) => {
  const { data, error } = await supabase
    .from('Daily_scores')
    .upsert({ 
      user_id: userId, 
      log_date: date, 
      total_score: score 
    }, { 
      onConflict: 'user_id,log_date' 
    });
  return { data, error };
};

// Vision Items (if you want to add this table later)
export const getVisionItems = async (userId) => {
  // Placeholder - add Vision_Items table to your schema if needed
  return { data: [], error: null };
};

export const createVisionItem = async (visionItem) => {
  // Placeholder
  return { data: null, error: null };
};

export const deleteVisionItem = async (id) => {
  // Placeholder
  return { data: null, error: null };
};