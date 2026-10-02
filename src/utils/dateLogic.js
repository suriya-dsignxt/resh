import { isBefore, isAfter, startOfDay, addDays } from 'date-fns';

const START_DATE = new Date('2026-02-07T00:00:00'); // Rose Day

// Helper to get day index (0 = Feb 7, 6 = Feb 14)
export const getDayIndex = (date = new Date()) => {
  const start = startOfDay(START_DATE);
  const current = startOfDay(date);
  const diffTime = Math.abs(current - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  
  // If before start date, return -1 (or handle as locked)
  if (isBefore(current, start)) return -1;
  
  return diffDays;
};

// Check if a specific memory quest (0-7) is unlocked
export const isDayUnlocked = (_dayIndex) => {
    // All memory quests are unlocked and playable
    return true;
};

// Get current day's content key
export const getDayKey = (index) => {
    const keys = ['meetup', 'keychain', 'copperKitchen', 'biriyani', 'milkshake', 'auto', 'godBless', 'vault'];
    return keys[index] || null;
};
