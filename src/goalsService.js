import { supabase } from './supabase';

export const saveGoal = async (userId, goalData) => {
  const { data, error } = await supabase
    .from('goals_manager')
    .insert([{
      user_id: userId,
      goal_name: goalData.name,
      target_points: goalData.targetPoints,
      current_points: 0,
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

export const calculatePhase = (currentPoints, targetPoints) => {
  const percentage = (currentPoints / targetPoints) * 100;
  if (percentage >= 100) return 'Completed';
  if (percentage >= 75) return 'Phase 4';
  if (percentage >= 50) return 'Phase 3';
  if (percentage >= 25) return 'Phase 2';
  return 'Phase 1';
};