import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useCustomerStore } from '../../zustand/customerStore';
import textInputStyles from '../styles/TextInputStyles';
import React, { useEffect, useState } from 'react';
import { createCustomer, updateCustomer } from '../../api/customer';
import {
  validateEmail,
  validateOtp,
  validatePhone,
} from '../../utils/validationData';
import { useStore } from 'zustand';
import { sendOTP, verifyOTP } from '../../api/otp';
import {
  Icon,
  Select,
  SelectTrigger,
  SelectInput,
  ChevronDownIcon,
  SelectItem,
  SelectPortal,
  SelectContent,
  SelectBackdrop,
  SelectDragIndicatorWrapper,
  SelectDragIndicator,
} from '@gluestack-ui/themed';
import textStyles from '../styles/TextStyles';
import buttonStyles from '../styles/ButtonStyles';
import { IDistrict, IProvince, IWard } from '../../interface/Customer';
import axios from 'axios';
import viewStyles from '../styles/ViewStyles';

const CustomerInfoOrder = () => {
  const customerState = useCustomerStore((state) => state.customerState.data);
  const { setCustomer } = useCustomerStore();

  const hasCustomerInfo = Object.keys(customerState).length > 0;
  const [otpClick, setOtpClick] = useState(false);
  const [otpValid, setOtpValid] = useState(false);
  const [error, setError] = useState({
    customerName: false,
    customerEmail: false,
    otp: false,
    name: false,
    customerPhone: false,
  });
  const [backupCustomerInfo, setBackupCustomerInfo] = useState({
    customerPhone: '',
    otp: '',
    customerName: '',
    customerEmail: '',
    customerNote: '',
    customerCode: '',
    address: {
      province: customerState?.address?.province || '',
      district: customerState?.address?.district || '',
      ward: customerState?.address?.ward || '',
      street: customerState?.address?.street || '',
    },
  });
  const [customerInfo, setCustomerInfo] = useState({
    customerPhone: '',
    otp: '',
    customerName: '',
    customerEmail: '',
    customerNote: '',
    customerCode: '',
    address: {
      province: customerState?.address?.province || '',
      district: customerState?.address?.district || '',
      ward: customerState?.address?.ward || '',
      street: customerState?.address?.street || '',
    },
  });
  const [editInfo, setEditInfo] = useState(true);
  const [existCustomer, setExistCustomer] = useState(false);
  const [provinces, setProvinces] = useState<IProvince[]>([]);
  const [districts, setDistricts] = useState<IDistrict[]>([]);
  const [wards, setWards] = useState<IWard[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        'https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json',
      );
      setProvinces(response.data);
      if (!hasCustomerInfo) {
        console.log('no customer info');
      } else if (customerState.address) {
        const selectedProvince = response.data.find(
          (province: IProvince) =>
            province.Name === customerState.address.province,
        );
        if (selectedProvince) {
          setDistricts(selectedProvince.Districts);
          const selectedDistrict = selectedProvince.Districts.find(
            (district: IDistrict) =>
              district.Name === customerState.address.district,
          );
          if (selectedDistrict) {
            setWards(selectedDistrict.Wards);
          }
        }
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (hasCustomerInfo) {
      setCustomerInfo({
        ...customerInfo,
        customerName: customerState.name,
        customerPhone: customerState.phoneNumber,
        customerCode: customerState.purrPetCode,
      });
      setExistCustomer(true);
      setEditInfo(false);
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

    setCustomerInfo({
      ...customerInfo,
      [name]: text,
    });
  };

  const handleSendOTPCLick = () => {
    if (!customerInfo.customerEmail) {
      setError({ ...error, customerEmail: true });
      return;
    }
    if (!validateEmail(customerInfo.customerEmail)) {
      setError({ ...error, customerEmail: true });
      return;
    }
    setError({ ...error, customerEmail: false });

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
    setError({ ...error, otp: false });
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

    setEditInfo(false);
  };
  const handleEditInfo = () => {
    if (existCustomer && !editInfo) {
      setEditInfo(true);
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
        setError({ ...error, ...err });
        return;
      }
      //api update customer
      updateCustomer({
        purrPetCode: customerInfo.customerCode,
        name: customerInfo.customerName,
        phoneNumber: customerInfo.customerPhone,
        address: {
          province: customerInfo.address.province,
          district: customerInfo.address.district,
          ward: customerInfo.address.ward,
          street: customerInfo.address.street,
        },
      }).then((res) => {
        if (res.err === 0) {
          setCustomer(res.data);
          console.log('after update customer oke');
        }
      });
      //oke
      setEditInfo(false);
    } else if (!existCustomer && editInfo) {
      if (!customerInfo.customerName) {
        setError({ ...error, customerName: true });
        return;
      }
      if (
        !customerInfo.customerPhone ||
        !validatePhone(customerInfo.customerPhone)
      ) {
        setError({ ...error, customerPhone: true });
        return;
      }

      console.log('create customer');
      //api create customer
      createCustomer({
        phoneNumber: customerInfo.customerPhone,
        email: customerInfo.customerEmail,
        name: customerInfo.customerName,
        address: {
          province: customerInfo.address.province,
          district: customerInfo.address.district,
          ward: customerInfo.address.ward,
          street: customerInfo.address.street,
        },
      }).then((res) => {
        if (res.err === 0) {
          console.log('after create customer oke');
          setCustomer(res.data);
          setError({ ...error, customerName: false, customerPhone: false });
        }
      });

      //oke
      setExistCustomer(true);
      setEditInfo(false);
    }
  };
  const handleChangeProvince = (value: string) => {
    const selectedProvince = provinces.find(
      (province: IProvince) => province.Name === value,
    ) as IProvince;
    if (selectedProvince) {
      setDistricts(selectedProvince.Districts);
      setCustomerInfo({
        ...customerInfo,
        address: {
          ...customerInfo.address,
          province: value,
          district: '',
          ward: '',
        },
      });
    }
  };

  const handleChangeDistrict = (value: string) => {
    const selectedDistrict = districts.find(
      (district: IDistrict) => district.Name === value,
    ) as IDistrict;
    if (selectedDistrict) {
      setWards(selectedDistrict.Wards);
      setCustomerInfo({
        ...customerInfo,
        address: {
          ...customerInfo.address,
          district: value,
          ward: '',
        },
      });
    }
  };

  const handleChangeWard = (value: string) => {
    setCustomerInfo({
      ...customerInfo,
      address: {
        ...customerInfo.address,
        ward: value,
      },
    });
  };

  const handleChangeStreet = (value: string) => {
    setCustomerInfo({
      ...customerInfo,
      address: {
        ...customerInfo.address,
        street: value,
      },
    });
  };

  return (
    <SafeAreaView style={{ margin: 5, backgroundColor: '#fff' }}>
      <View style={{ marginTop: 10 }}>
        <Text
          style={[
            textStyles.label,
            {
              textAlign: 'center',
            },
          ]}
        >
          Thông tin nhận hàng
        </Text>
        {!hasCustomerInfo && (
          <View style={{ margin: 10 }}>
            <View>
              <Text style={textStyles.label} className='mb-3'>
                Email:
              </Text>
              <TextInput
                placeholder='Email'
                style={textInputStyles.textInputBorder}
                value={customerInfo.customerEmail}
                editable={!otpValid}
                onChange={(event) =>
                  handleChangeCustomerInfo(event, 'customerEmail')
                }
              />
              {error.customerEmail && (
                <Text style={textStyles.error}>Email không hợp lệ!</Text>
              )}

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
                  keyboardType='numeric'
                  onChange={(event) => handleChangeCustomerInfo(event, 'otp')}
                />
                {error.otp && (
                  <Text style={textStyles.error}>Mã OTP không hợp lệ!</Text>
                )}
                <TouchableOpacity
                  style={buttonStyles.buttonConfirm}
                  onPress={() => handleValidOTPCLick()}
                >
                  <Text
                    style={{
                      color: '#fff',
                      alignSelf: 'center',
                      fontWeight: 'bold',
                    }}
                  >
                    Xác thực
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        {otpValid && (
          <View style={{ margin: 10 }}>
            <Text style={textStyles.label} className='mb-3'>
              Tên khách hàng
            </Text>
            <TextInput
              placeholder='Tên khách hàng'
              style={textInputStyles.textInputBorder}
              value={customerInfo.customerName}
              editable={editInfo}
              onChange={(event) =>
                handleChangeCustomerInfo(event, 'customerName')
              }
            />
            {error.customerName && (
              <Text style={textStyles.error}>Tên không được để trống!</Text>
            )}
            <Text style={textStyles.label} className='mt-3 mb-3'>
              Số điện thoại
            </Text>
            <TextInput
              placeholder='Số điện thoại'
              style={textInputStyles.textInputBorder}
              value={customerInfo.customerPhone}
              keyboardType='numeric'
              editable={editInfo}
              onChange={(event) =>
                handleChangeCustomerInfo(event, 'customerPhone')
              }
            />
            {error.customerPhone && (
              <Text style={textStyles.error}>Số điện thoại không hợp lệ!</Text>
            )}
            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'flex-end',
              }}
            ></View>
            <View>
              <Text style={textStyles.label} className='my-1.5'>
                Địa chỉ:
              </Text>
              <View style={viewStyles.flexColumn}>
                <Text style={textStyles.miniLabel}>Tỉnh/Thành phố:</Text>
                <Select
                  selectedValue={customerInfo.address?.province || ''}
                  isDisabled={!editInfo}
                  onValueChange={(value: string) => {
                    handleChangeProvince(value);
                  }}
                >
                  <SelectTrigger variant='outline' size='md'>
                    <SelectInput
                      placeholder='Tỉnh/Thành phố'
                      style={textInputStyles.selectInput}
                    />
                    <View className='m-3 mt-4'>
                      <Icon as={ChevronDownIcon} />
                    </View>
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectBackdrop />
                    <SelectContent>
                      <SelectDragIndicatorWrapper>
                        <SelectDragIndicator />
                      </SelectDragIndicatorWrapper>
                      <ScrollView className='w-full'>
                        {provinces.map((province: IProvince) => (
                          <SelectItem
                            key={province.Id}
                            label={province.Name}
                            value={province.Name}
                          />
                        ))}
                      </ScrollView>
                    </SelectContent>
                  </SelectPortal>
                </Select>
                <Text style={textStyles.miniLabel} className='mt-1'>
                  Quận/Huyện:
                </Text>
                <Select
                  selectedValue={customerInfo.address?.district || ''}
                  isDisabled={districts.length === 0 || !editInfo}
                  onValueChange={(value: string) => {
                    handleChangeDistrict(value);
                  }}
                >
                  <SelectTrigger variant='outline' size='md'>
                    <SelectInput
                      placeholder='Quận/Huyện'
                      style={textInputStyles.selectInput}
                    />
                    <View className='m-3 mt-4'>
                      <Icon as={ChevronDownIcon} />
                    </View>
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectBackdrop />
                    <SelectContent>
                      <SelectDragIndicatorWrapper>
                        <SelectDragIndicator />
                      </SelectDragIndicatorWrapper>
                      <ScrollView className='w-full'>
                        {districts.map((district: IDistrict) => (
                          <SelectItem
                            key={district.Id}
                            label={district.Name}
                            value={district.Name}
                          />
                        ))}
                      </ScrollView>
                    </SelectContent>
                  </SelectPortal>
                </Select>
                <Text style={textStyles.miniLabel} className='mt-1'>
                  Phường/Xã:
                </Text>
                <Select
                  selectedValue={customerInfo.address?.ward || ''}
                  isDisabled={wards.length === 0 || !editInfo}
                  onValueChange={(value: string) => {
                    handleChangeWard(value);
                  }}
                >
                  <SelectTrigger variant='outline' size='md'>
                    <SelectInput
                      placeholder='Phường/Xã'
                      style={textInputStyles.selectInput}
                    />
                    <View className='m-3 mt-4'>
                      <Icon as={ChevronDownIcon} />
                    </View>
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectBackdrop />
                    <SelectContent>
                      <SelectDragIndicatorWrapper>
                        <SelectDragIndicator />
                      </SelectDragIndicatorWrapper>
                      <ScrollView className='w-full'>
                        {wards.map((ward: IWard) => (
                          <SelectItem
                            key={ward.Id}
                            label={ward.Name}
                            value={ward.Name}
                          />
                        ))}
                      </ScrollView>
                    </SelectContent>
                  </SelectPortal>
                </Select>
                <Text style={textStyles.miniLabel} className='mt-1'>
                  Đường:
                </Text>
                <TextInput
                  style={textInputStyles.textInputBorder}
                  value={customerInfo.address?.street}
                  onChangeText={(value) => {
                    handleChangeStreet(value);
                  }}
                  editable={editInfo}
                />
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignContent: 'flex-end' }}>
              <TouchableOpacity
                style={buttonStyles.buttonConfirm}
                onPress={() => handleEditInfo()}
              >
                <Text
                  style={{
                    color: '#ffff',
                    fontSize: 15,
                    alignSelf: 'center',
                    fontWeight: 'bold',
                  }}
                >
                  {!editInfo ? 'Sửa' : 'Xác nhận thông tin'}
                </Text>
              </TouchableOpacity>
              {existCustomer && editInfo && (
                <TouchableOpacity
                  style={[
                    buttonStyles.buttonOutline,
                    { width: '30%', marginLeft: 10 },
                  ]}
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
              )}
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default CustomerInfoOrder;
