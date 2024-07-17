import api from './token';
import Realm from 'realm';
import TokenSchema from '../realmModel/TokenSchema';
import { saveToken } from './auth';

const realm = new Realm({ schema: [TokenSchema] });

export interface SendOTPBody {
  email: string;
}

export interface VerifyOTPBody {
  email: string;
  otp: string;
}

export async function sendOTP(body: SendOTPBody) {
  try {
    const response = await api.post('/otp/send', body);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function verifyOTP(body: VerifyOTPBody) {
  try {
    const response = await api.post('/otp/verify', body);
    if (
      response.data.err === 0 &&
      response.data.access_token &&
      response.data.refresh_token
    ) {
      saveToken(response.data.access_token, response.data.refresh_token);
    }
    return response.data;
  } catch (error) {
    console.log(error);
  }
}
