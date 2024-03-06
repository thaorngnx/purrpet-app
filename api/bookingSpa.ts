import api from './token';

export async function getBookingSpas(params: any) {
  try {
    const response = await api.get('bookingSpa/query?order=createdAt.desc', {
      params,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getBookingSpaByCode(code: any) {
  try {
    const response = await api.get(`bookingSpa/${code}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getBookingSpaByCustomer() {
  try {
    const response = await api.get('bookingSpa/get-by-customer');
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function createBookingSpa(bookingSpa: any) {
  try {
    const response = await api.post('bookingSpa/create', bookingSpa);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function updateBookingSpa(bookingSpa: any) {
  try {
    const response = await api.put(
      `bookingSpa/update/${bookingSpa.purrPetCode}`,
      bookingSpa,
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function updateStatusBookingSpa(
  bookingSpaCode: string,
  newStatus: string,
) {
  try {
    const response = await api.put(
      `bookingSpa/update-status/${bookingSpaCode}`,
      { status: newStatus },
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getAvailableTime(params: any) {
  try {
    const response = await api.get('bookingSpa/get-available-time', {
      params,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
