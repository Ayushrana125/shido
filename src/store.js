const STORAGE_KEY = 'shido-data';

const defaultState = {
  profile: { name: 'Ayush', birthdate: '', photo: '' },
  habits: [],
  goals: [],
  todayScore: 0,
  totalScore: 0,
  dailyLogs: {},
  actionsLog: [],
  vision: []
};

export const getState = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? { ...defaultState, ...JSON.parse(stored) } : defaultState;
  } catch {
    return defaultState;
  }
};

export const setState = (newState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
};

export const getTodayKey = () => {
  return new Date().toISOString().split('T')[0];
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};