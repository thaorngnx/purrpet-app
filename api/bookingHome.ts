import api from './token';

export async function getBookingHomes(params: any) {
  try {
    const response = await api.get('bookingHome/query?order=createdAt.desc', {
      params,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getBookingHomeByCode(code: string) {
  try {
    const response = await api.get(`bookingHome/${code}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getBookingHomeByCustomer() {
  try {
    const response = await api.get('bookingHome/get-by-customer');
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function createBookingHome(bookingHome: any) {
  console.log(bookingHome);
  try {
    const response = await api.post('bookingHome/create', bookingHome);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function updateBookingHome(bookingHome: any) {
  try {
    const response = await api.put(
      `bookingHome/update/${bookingHome.purrPetCode}`,
      bookingHome,
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function updateStatusBookingHome(
  bookingHomeCode: string,
  newStatus: string,
) {
  try {
    const response = await api.put(
      `bookingHome/update-status/${bookingHomeCode}`,
      { status: newStatus },
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getUnavailableDay(params: any) {
  try {
    const response = await api.get('bookingHome/get-unavailable-day', {
      params,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
