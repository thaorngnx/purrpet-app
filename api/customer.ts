import api from './token';
// import Realm from 'realm';
// import TokenSchema from '../realmModel/TokenSchema';
import { saveToken } from './auth';

// const realm = new Realm({ schema: [TokenSchema] });

export interface Customer {
  purrPetCode: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: {
    street: string;
    ward: string;
    district: string;
    province: string;
  };
  point: number;
  coin: number;
  role: string;
  accessToken: string;
  refreshToken: string;
}

export async function getCustomerByCode(code: string) {
  try {
    const response = await api.get(`customer/${code}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getCustomerById() {
  try {
    const response = await api.get(`customer/find-by-id`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function createCustomer(body: any) {
  try {
    const response = await api.post('/customer/create', body);
    //save token to realm
    console.log(response);
    if (
      response.data.err === 0 &&
      response.data.data.accessToken &&
      response.data.data.refreshToken
    ) {
      saveToken(
        response.data.data.accessToken,
        response.data.data.refreshToken,
      );
    }
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function updateCustomer(body: any) {
  try {
    const cus = { ...body };
    delete cus.email;
    delete cus.point;
    const response = await api.put(`/customer/update/${cus.purrPetCode}`, cus);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}
