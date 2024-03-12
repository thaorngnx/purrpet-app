import api from './token';

export async function getMasterDatas(params: any) {
  try {
    const response = await api.get('masterData/query', { params });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getMasterDataByCode(code: any) {
  try {
    const response = await api.get(`masterData/${code}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
