import api from './token';
export async function getActiveCategories(params: any) {
  try {
    const response = await api.get('category/query-customer', { params });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
