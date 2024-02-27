import api from "./token";

export async function sendOTP(email: string) {
  try {
    const response = await api.post('/otp/send', {
      email: email
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
}