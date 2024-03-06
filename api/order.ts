import api from './token';

export async function getOrders(params: any) {
  try {
    const response = await api.get('order/query?order=createdAt.desc', {
      params,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getOrderByCode(code: string) {
  try {
    const response = await api.get(`order/${code}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getOrdersByCustomer() {
  try {
    const response = await api.get('order/get-by-customer');
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function createOrder(order: any) {
  try {
    const response = await api.post('order/create', order);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function updateOrder(order: any) {
  try {
    const response = await api.put(`order/update/${order.purrPetCode}`, order);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function updateStatusOrder(orderCode: string, newStatus: string) {
  try {
    const response = await api.put(`order/update-status/${orderCode}`, {
      status: newStatus,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
