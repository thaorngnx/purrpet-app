import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useCustomerStore } from '../../zustand/customerStore';
import textInputStyles from '../styles/TextInputStyles';
import { useEffect, useState } from 'react';
import { createCustomer, updateCustomer } from '../../api/customer';
import {
  validateEmail,
  validateOtp,
  validatePhone,
} from '../../utils/validationData';
import { useStore } from 'zustand';
import { sendOTP, verifyOTP } from '../../api/otp';
import { Textarea, TextareaInput } from '@gluestack-ui/themed';
import textStyles from '../styles/TextStyles';
import buttonStyles from '../styles/ButtonStyles';

const CustomerInfoForm = ({ customer, confirmInfo }: any) => {
  const customerState = useCustomerStore((state) => state.customerState.data);
  const { setCustomer } = useCustomerStore();

  const hasCustomerInfo = Object.keys(customerState).length > 0;
  const [otpClick, setOtpClick] = useState(false);
  const [otpValid, setOtpValid] = useState(false);
  const [error, setError] = useState({});
  const [backupCustomerInfo, setBackupCustomerInfo] = useState({
    customerPhone: '',
    otp: '',
    customerName: '',
    customerEmail: '',
    customerNote: '',
    customerCode: '',
  });
  const [customerInfo, setCustomerInfo] = useState({
    customerPhone: '',
    otp: '',
    customerName: '',
    customerEmail: '',
    customerNote: '',
    customerCode: '',
  });
  const [editInfo, setEditInfo] = useState(true);
  const [existCustomer, setExistCustomer] = useState(false);

  useEffect(() => {
    if (hasCustomerInfo) {
      console.log('customerState', customerState);
      customer({
        ...customerInfo,
        customerCode: customerState.purrPetCode,
      });
      setCustomerInfo({
        ...customerInfo,
        customerName: customerState.name,
        customerPhone: customerState.phoneNumber,
        customerCode: customerState.purrPetCode,
      });
      setExistCustomer(true);
      setEditInfo(false);
      confirmInfo(true);
      setOtpValid(true);
    }
  }, [customerState, hasCustomerInfo]);

  useEffect(() => {
    if (!editInfo) {
      setBackupCustomerInfo({ ...customerInfo });
    }
  }, [editInfo]);

  const handleChangeCustomerInfo = (event: any, name: string) => {
    const { text } = event.nativeEvent;
    if (!text) {
      setError({ ...error, name: true });
    } else {
      setError({ ...error, name: false });
    }
    customer({ ...customerInfo, name: text });
    setCustomerInfo({
      ...customerInfo,
      [name]: text,
    });
  };

  const handleSendOTPCLick = () => {
    console.log('send otp', customerInfo.customerEmail);
    if (!customerInfo.customerEmail) {
      setError({ ...error, customerEmail: true });
      return;
    }
    if (!validateEmail(customerInfo.customerEmail)) {
      setError({ ...error, customerEmail: true });
      return;
    }
    //api send otp
    sendOTP({ email: customerInfo.customerEmail }).then((res) => {
      if (res.err === 0) {
        setCustomerInfo({ ...customerInfo, otp: '' });
        setOtpClick(true);
      }
    });
  };

  const handleValidOTPCLick = () => {
    console.log('validate otp');
    if (!customerInfo.otp) {
      setError({ ...error, otp: true });
      return;
    }
    if (!validateOtp(customerInfo.otp)) {
      setError({ ...error, otp: true });
      return;
    }
    //api check otp
    verifyOTP({
      email: customerInfo.customerEmail,
      otp: customerInfo.otp,
    }).then((res) => {
      console.log(res);
      if (res.err === 0) {
        setOtpValid(true);
        if (res.data === null) {
          console.log('customer not exist');
          setExistCustomer(false);
          setEditInfo(true);
        } else {
          setCustomer(res.data);
        }
      } else {
        customerInfo.otp = '';
        setError({ ...error, otp: true });
      }
    });
  };

  const handleCancelEdit = () => {
    setCustomerInfo({ ...backupCustomerInfo });
    customer({ ...backupCustomerInfo });
    setEditInfo(false);
  };
  const handleEditInfo = () => {
    console.log('edit info', editInfo, 'existCustomer', existCustomer);
    if (existCustomer && !editInfo) {
      setEditInfo(true);
      confirmInfo(false);
    } else if (existCustomer && editInfo) {
      console.log('edit customer');
      let err = {};
      if (!customerInfo.customerName) {
        err = { ...err, customerName: true };
      }
      if (
        !customerInfo.customerPhone ||
        !validatePhone(customerInfo.customerPhone)
      ) {
        err = { ...err, customerPhone: true };
      }
      if (Object.keys(err).length > 0) {
        setError(err);
        return;
      }
      //api update customer
      updateCustomer({
        purrPetCode: customerInfo.customerCode,
        name: customerInfo.customerName,
        phoneNumber: customerInfo.customerPhone,
      }).then((res) => {
        if (res.err === 0) {
          console.log('after update customer oke');
          // setCustomerInfo({
          //   ...customerInfo,
          //   customerName: res.data.name,
          //   customerPhone: res.data.phoneNumber,
          // });
        }
      });
      //oke
      setEditInfo(false);
      confirmInfo(true);
    } else if (!existCustomer && editInfo) {
      console.log('create customer');
      //api create customer
      createCustomer({
        phoneNumber: customerInfo.customerPhone,
        email: customerInfo.customerEmail,
        name: customerInfo.customerName,
      }).then((res) => {
        if (res.err === 0) {
          console.log('after create customer oke');
          setCustomer(res.data);
        }
      });

      //oke
      setExistCustomer(true);
      setEditInfo(false);
      confirmInfo(true);
    }
  };
  return (
    <SafeAreaView style={{ margin: 5 }}>
      <View>
        <Text style={textStyles.labelCenter}>Thông tin khách hàng</Text>
        {!hasCustomerInfo && (
          <View>
            <View>
              <Text style={textStyles.label}>Email:</Text>
              <TextInput
                placeholder='Email'
                style={textInputStyles.textInputBorder}
                value={customerInfo.customerEmail}
                editable={!otpValid}
                onChange={(event) =>
                  handleChangeCustomerInfo(event, 'customerEmail')
                }
              />

              {otpClick && !otpValid && (
                <View>
                  <Text style={textStyles.hintBoldItalic}>
                    Mã OTP đã được gửi đến email của bạn và có hiệu lực trong 5
                    phút
                  </Text>
                </View>
              )}
            </View>
            {!otpValid && (
              <View style={{ alignSelf: 'flex-end' }}>
                <TouchableOpacity
                  style={buttonStyles.buttonConfirm}
                  onPress={() => handleSendOTPCLick()}
                >
                  <Text
                    style={{
                      color: '#fff',
                      fontWeight: 'bold',
                      alignSelf: 'center',
                    }}
                  >
                    {otpClick ? 'Gửi lại OTP' : 'Gửi OTP'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            {otpClick && !otpValid && (
              <View>
                <Text style={textStyles.label}>OTP:</Text>
                <TextInput
                  value={customerInfo.otp}
                  placeholder='Mã OTP'
                  style={textInputStyles.textInputBorder}
                  onChange={(event) => handleChangeCustomerInfo(event, 'otp')}
                />
                <TouchableOpacity
                  style={buttonStyles.buttonConfirm}
                  onPress={() => handleValidOTPCLick()}
                >
                  <Text>Xác thực</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        {otpValid && (
          <View>
            <Text style={textStyles.label}>Tên khách hàng</Text>
            <TextInput
              placeholder='Tên khách hàng'
              style={textInputStyles.textInputBorder}
              value={customerInfo.customerName}
              editable={editInfo}
              onChange={(event) =>
                handleChangeCustomerInfo(event, 'customerName')
              }
            />
            <Text style={textStyles.label}>Số điện thoại</Text>
            <TextInput
              placeholder='Số điện thoại'
              style={textInputStyles.textInputBorder}
              value={customerInfo.customerPhone}
              editable={editInfo}
              onChange={(event) =>
                handleChangeCustomerInfo(event, 'customerPhone')
              }
            />
            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'flex-end',
              }}
            >
              {existCustomer && editInfo && (
                <View style={{ marginRight: 10 }}>
                  <TouchableOpacity
                    style={buttonStyles.buttonOutline}
                    onPress={() => handleCancelEdit()}
                  >
                    <Text
                      style={{
                        color: '#000',
                        fontSize: 15,
                        alignSelf: 'center',
                        fontWeight: 'bold',
                      }}
                    >
                      Huỷ
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              <TouchableOpacity
                style={buttonStyles.buttonConfirm}
                onPress={() => handleEditInfo()}
              >
                <Text
                  style={{ color: '#ffff', fontSize: 15, alignSelf: 'center' }}
                >
                  {!editInfo ? 'Sửa' : 'Xác nhận thông tin'}
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={textStyles.label}>Ghi chú</Text>
            <Textarea
              size='md'
              isReadOnly={false}
              isInvalid={false}
              isDisabled={false}
              w='100%'
            >
              <TextareaInput
                value={customerInfo.customerNote}
                placeholder='Your text goes here...'
                onChange={(event) =>
                  handleChangeCustomerInfo(event, 'customerNote')
                }
              />
            </Textarea>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};
export default CustomerInfoForm;
