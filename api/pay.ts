import api from './token';

export async function createPaymentUrl(body: any) {
  try {
    const response = await api.post('pay/createPaymentUrl', body);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function vnpayReturn(body: any) {
  try {
    const response = await api.post('pay/vnpayReturn', body);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
