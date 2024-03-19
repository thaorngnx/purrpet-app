import api from './token';

export async function addToCart(cart: any) {
  try {
    console.log(cart);
    const response = await api.post('cart/add', cart, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getCart() {
  try {
    const response = await api.get('cart/get', {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function updateCart(cart: any) {
  try {
    const response = await api.put('cart/update', cart, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function deleteCart() {
  try {
    const response = await api.delete('cart/delete', {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function deleteProductCart(product: any) {
  try {
    console.log(product);
    const response = await api.delete('cart/delete-product', {
      data: product,
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
