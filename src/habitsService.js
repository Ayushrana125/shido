import { supabase } from './supabase';

export const saveHabit = async (userId, habitData) => {
  const { data, error } = await supabase
    .from('habits_manager')
    .insert([{
      user_id: userId,
      habit_name: habitData.name,
      habit_type: habitData.type === 'positive' ? 0 : 1,
      goal_id: habitData.goalId,
      points: habitData.points,
      confirmation_msg: habitData.message,
      created_at: new Date().toISOString()
    }])
    .select()
    .single();

  return { data, error };
};

export const getHabits = async (userId) => {
  const { data, error } = await supabase
    .from('habits_manager')
    .select(`
      *,
      goals_manager(goal_name)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return { data, error };
};

export const updateHabit = async (habitId, updates) => {
  const { data, error } = await supabase
    .from('habits_manager')
    .update(updates)
    .eq('habit_id', habitId)
    .select()
    .single();

  return { data, error };
};

export const deleteHabit = async (habitId) => {
  const { error } = await supabase
    .from('habits_manager')
    .delete()
    .eq('habit_id', habitId);

  return { error };
};