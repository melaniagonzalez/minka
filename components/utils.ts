
// Helper function to calculate business days
export const calculateBusinessDays = (start: Date, end: Date, workdays: number[]): number => {
  let count = 0;
  const workdaySet = new Set(workdays);

  const currentDate = new Date(start);
  currentDate.setHours(0, 0, 0, 0);

  const finalDate = new Date(end);
  finalDate.setHours(0, 0, 0, 0);

  if (currentDate > finalDate) return 0;

  while (currentDate <= finalDate) {
    if (workdaySet.has(currentDate.getDay())) {
      count++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return count > 0 ? count : 1; // A task must have at least 1 day duration
};

// Helper function to calculate end date from start date and duration in business days
export const calculateEndDate = (start: Date, duration: number, workdays: number[]): Date => {
  if (duration <= 0) return new Date(start);

  const workdaySet = new Set(workdays);
  let currentDate = new Date(start);
  currentDate.setHours(0, 0, 0, 0);
  
  let daysCounted = 0;

  // Find the first valid workday to start counting from
  while (!workdaySet.has(currentDate.getDay())) {
    currentDate.setDate(currentDate.getDate() + 1);
  }

  while (daysCounted < duration) {
    if (workdaySet.has(currentDate.getDay())) {
      daysCounted++;
    }
    if (daysCounted < duration) {
        currentDate.setDate(currentDate.getDate() + 1);
    }
  }
  return currentDate;
};