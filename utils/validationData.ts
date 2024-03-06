//validate email
export const validateEmail = (email: string) => {
  //email regex can have 1 or 2 dots in the domain name
  const emailRegex =
    /^[a-zA-Z0-9]+([.]{1,2}[a-zA-Z0-9]+)*@[a-zA-Z0-9]+([.]{1,2}[a-zA-Z0-9]+)*[.]{1}[a-zA-Z]{2,4}$/;
  return emailRegex.test(email);
};

//validate password: min 8 characters, 1 special character
export const validatePassword = (password: string) => {
  const passwordRegex = /^(?=.*[!@#$%^&*()_+]).{8,}$/;
  return passwordRegex.test(password);
};

//validate name: min 2 characters, no special characters
export const validateName = (name: string) => {
  const nameRegex = /^[a-zA-Z]{2,}$/;
  return nameRegex.test(name);
};

//validate phone number: 10 digits, no special characters
export const validatePhone = (phone: string) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
};

//validate otp: 4 digits, no special characters
export const validateOtp = (otp: string) => {
  const otpRegex = /^[0-9]{4}$/;
  return otpRegex.test(otp);
};

//validate object not have any empty value
export const validateObject = (object: any) => {
  for (let key in object) {
    if (key === 'customerNote') continue;
    if (
      key === 'dateCheckIn' ||
      key === 'dateCheckOut' ||
      key === 'bookingDate'
    ) {
      if (object[key] === null) {
        return false;
      }
      continue;
    }
    if (object[key] === '') {
      return false;
    }
  }
  return true;
};
