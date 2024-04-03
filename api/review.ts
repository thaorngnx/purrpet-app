import api from './token';

export async function createReview(review: any) {
  try {
    const response = await api.post('review/create', review);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
