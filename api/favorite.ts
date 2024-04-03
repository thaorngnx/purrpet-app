import api from './token';

export async function getFavorites(params: any) {
  try {
    const response = await api.get('favorite', { params });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function favoriteProduct(productCode: string) {
  try {
    const response = await api.post(`favorite/${productCode}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
