import { supabase } from './supabase';

export const logHabitCompletion = async (userId, habitId, points, habitType, goalId = null) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // 1. Log in check_mark_habit_logs
    const { data: logData, error: logError } = await supabase
      .from('check_mark_habit_logs')
      .insert([{
        user_id: userId,
        habit_id: habitId,
        goal_id: goalId,
        points: points,
        habit_type: habitType,
        log_date: today
      }])
      .select()
      .single();

    if (logError) throw logError;

    // 2. Update goal current_points if habit is associated with a goal
    if (goalId) {
      // First get current points
      const { data: goalData, error: fetchError } = await supabase
        .from('goals_manager')
        .select('current_points')
        .eq('goal_id', goalId)
        .eq('user_id', userId)
        .single();

      if (fetchError) throw fetchError;

      const pointsChange = habitType === 0 ? points : -points;
      const newPoints = (goalData.current_points || 0) + pointsChange;
      
      const { error: goalError } = await supabase
        .from('goals_manager')
        .update({ current_points: newPoints })
        .eq('goal_id', goalId)
        .eq('user_id', userId);

      if (goalError) throw goalError;
    }

    return { data: logData, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const getTodayHabitLogs = async (userId) => {
  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('check_mark_habit_logs')
    .select('habit_id, points')
    .eq('user_id', userId)
    .eq('log_date', today);

  return { data, error };
};

export const getDashboardHabits = async (userId) => {
  const { data, error } = await supabase
    .from('habits_manager')
    .select(`
      *,
      goals_manager(goal_name, goal_id)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return { data, error };
};