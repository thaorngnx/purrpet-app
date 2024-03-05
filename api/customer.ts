import api from './token';
import Realm from 'realm';
import TokenSchema from '../realmModel/TokenSchema';

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

export async function getCustomerById(id: string) {
  try {
    const response = await api.post(`customer/find-by-id/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

//TODO: change any to correct type
export async function createCustomer(body: any) {
  try {
    const response = await api.post('/customer/create', body);
    //save token to realm
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

//TODO: change any to correct type
export async function updateCustomer(body: any) {
  try {
    const response = await api.post(
      `/customer/update/${body.purrPetCode}`,
      body,
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}
