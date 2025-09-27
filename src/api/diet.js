import axios from 'axios';

const BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5050';

export async function fetchDietPlan(payload) {
  const url = `${BASE}/api/v1/diet/plan`;
  const { data } = await axios.post(url, payload);
  return data;
}
