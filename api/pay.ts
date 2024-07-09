import api from './token';

export async function createPaymentUrl(body: any) {
  try {
    const response = await api.post('pay/createPaymentUrl', body);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

// export async function vnpayReturn(body: any) {
//   try {
//     const response = await api.post('pay/vnpayReturn', body);
//     return response.data;
//   } catch (error) {
//     console.error(error);
//   }
// }

export async function requestRefund(body: any) {
  try {
    console.log('body', body);
    const response = await api.post('pay/request-refund', body);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
export async function Statistics(params: any) {
  try {
    const response = await api.get('pay/financial-statistics', { params });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
