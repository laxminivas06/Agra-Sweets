import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

export const getSweets = async () => {
  try {
    const res = await fetch('/sweets.json');
    const sweets = await res.json();
    return sweets;
  } catch (error) {
    console.error('Error fetching sweets:', error);
    return [];
  }
};

export const saveSweets = async (sweets) => {
  try {
    await axios.post(`${API_URL}/save-sweets`, sweets);
    console.log('Sweets saved to sweets.json successfully');
  } catch (error) {
    console.error('Error saving sweets to file:', error);
    // Fallback to localStorage
    localStorage.setItem('sweets', JSON.stringify(sweets));
  }
};

export const getSweetByQR = async (qr) => {
  const sweets = await getSweets();
  return sweets.find(s => s.qr === qr || s.id.toString() === qr);
};

export const getBills = async () => {
  try {
    const res = await fetch('/bills.json');
    const bills = await res.json();
    return bills;
  } catch (error) {
    console.error('Error fetching bills:', error);
    return [];
  }
};

export const saveBills = async (bills) => {
  try {
    await axios.post(`${API_URL}/save-bills`, bills);
    console.log('Bills saved to bills.json successfully');
  } catch (error) {
    console.error('Error saving bills to file:', error);
    // Fallback to localStorage
    localStorage.setItem('bills', JSON.stringify(bills));
  }
};

export const checkAdminLogin = async (username, password) => {
  try {
    const res = await fetch('/admin.json');
    const admin = await res.json();
    return (admin.username === username && admin.password === password);
  } catch {
    return (username === 'admin' && password === '123'); // Failsafe
  }
};
