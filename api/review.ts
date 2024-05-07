import api from './token';

export async function createReview(review: any) {
  try {
    const response = await api.post('review/create', review);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getReivewByCodeAndCustomer(
  orderCode: string,
  productCode: string,
) {
  try {
    const response = await api.get(
      `product/customer/${orderCode}/${productCode}`,
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getReviewByProduct(productCode: string, params: any) {
  try {
    const response = await api.get(`review/product/${productCode}`, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
