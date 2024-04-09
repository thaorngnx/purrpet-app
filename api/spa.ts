import api from './token';

export async function getSpas(params: any) {
  try {
    const response = await api.get('spa/query', { params });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getActiveSpas() {
  try {
    const response = await api.get('spa/query-customer');
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getSpaByCode(code: string) {
  try {
    const response = await api.get(`spa/${code}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function createSpa(spa: any) {
  try {
    const response = await api.post('spa/create', spa, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function updateSpa(spa: any) {
  try {
    const response = await api.put(`spa/update/${spa.purrPetCode}`, spa, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function updateStatusSpa(purrPetCode: any) {
  try {
    const response = await api.put(`spa/update-status/${purrPetCode}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getreportSpa(date: any) {
  try {
    const response = await api.post(`spa/spa-report`, date);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
