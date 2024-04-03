import api from './token';

export async function getProducts(params: any) {
  try {
    const response = await api.get('product/query', { params });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getActiveProducts(params: any) {
  try {
    const response = await api.get('product/query-customer', { params });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getProductByCode(code: string) {
  try {
    const response = await api.get(`product/${code}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getProductDetailByCode(code: string) {
  try {
    const response = await api.get(`product/detail/${code}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function createProduct(product: any) {
  try {
    console.log('req', product);
    const response = await api.post('product/create', product, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function updateProduct(product: any) {
  try {
    console.log('req', product);
    const response = await api.put(
      `product/update/${product.purrPetCode}`,
      product,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function updateStatusProduct(purrPetCode: string) {
  try {
    const response = await api.put(`product/update-status/${purrPetCode}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function reportProduct(date: any) {
  try {
    const response = await api.post(`product/report-product`, date);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getProductStaff(params: any) {
  try {
    const response = await api.get('product/query-staff', { params });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getProductBestSeller(params: any) {
  try {
    const response = await api.get('product/best-seller', { params });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
