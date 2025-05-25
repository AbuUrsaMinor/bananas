// Test localStorage functionality
export function testLocalStorage() {
  try {
    localStorage.setItem('test-key', 'test-value');
    console.log('LocalStorage write successful');
    const value = localStorage.getItem('test-key');
    console.log('Read value:', value);
    return true;
  } catch (e) {
    console.error('LocalStorage error:', e);
    return false;
  }
}