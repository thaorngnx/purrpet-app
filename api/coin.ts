import api from './token';
export async function getCoins() {
  try {
    const response = await api.get('coin/getCoin');
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
