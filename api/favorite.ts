import api from './token';

export async function getFavorite() {
  try {
    const response = await api.get('favorite');
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getFavoriteProductDetail(params: any) {
  try {
    const response = await api.get('favorite/detail', { params });
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
