import api from './token';

export async function getHomestays(params: any) {
  try {
    const response = await api.get('homestay/query', { params });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getActiveHomestays(params: any) {
  try {
    const response = await api.get('homestay/query-customer', { params });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getHomestayByCode(code: any) {
  try {
    const response = await api.get(`homestay/${code}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
