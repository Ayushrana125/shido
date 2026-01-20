import { supabase } from './supabase';

export const saveGoal = async (userId, goalData) => {
  const { data, error } = await supabase
    .from('goals_manager')
    .insert([{
      user_id: userId,
      goal_name: goalData.name,
      target_points: goalData.targetPoints,
      current_points: 0,
      phase: goalData.phase,
      created_at: new Date().toISOString()
    }])
    .select()
    .single();

  return { data, error };
};

export const getGoals = async (userId) => {
  const { data, error } = await supabase
    .from('goals_manager')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return { data, error };
};

export const updateGoal = async (goalId, updates) => {
  const { data, error } = await supabase
    .from('goals_manager')
    .update(updates)
    .eq('goal_id', goalId)
    .select()
    .single();

  return { data, error };
};

export const deleteGoal = async (goalId) => {
  const { error } = await supabase
    .from('goals_manager')
    .delete()
    .eq('goal_id', goalId);

  return { error };
};