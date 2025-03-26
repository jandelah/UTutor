import { MOCK_DASHBOARD_STATS } from '../mockData';

// Simular delay para emular peticiones a API
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Get dashboard stats
export const getDashboardStats = async () => {
  await delay(700);
  return MOCK_DASHBOARD_STATS;
};