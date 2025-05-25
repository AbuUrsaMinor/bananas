// Clear local storage on startup
export function clearStorage() {
  try {
    localStorage.removeItem('fruit-storage');
    console.log('Cleared fruit-storage from localStorage');
  } catch (e) {
    console.error('Error clearing localStorage:', e);
  }
}