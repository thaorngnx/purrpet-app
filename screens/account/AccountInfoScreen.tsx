import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import textStyles from '../styles/TextStyles';
import buttonStyles from '../styles/ButtonStyles';
import { useCustomerStore } from '../../zustand/customerStore';
import viewStyles from '../styles/ViewStyles';
import {
  Select,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectTrigger,
  Icon,
  ChevronDownIcon,
  ArrowLeftIcon,
  set,
} from '@gluestack-ui/themed';
import axios from 'axios';
import textInputStyles from '../styles/TextInputStyles';
import {
  ICustomer,
  IDistrict,
  IProvince,
  IWard,
} from '../../interface/Customer';

const AccountInfoScreen = ({ navigation, route }: any) => {
  const customer = useCustomerStore((state) => state.customerState.data);

  const { updateCustomer } = useCustomerStore();

  const [error, setError] = useState({});
  const [editInfo, setEditInfo] = useState(false);
  const [provinces, setProvinces] = useState<IProvince[]>([]);
  const [districts, setDistricts] = useState<IDistrict[]>([]);
  const [wards, setWards] = useState<IWard[]>([]);
  //backup customer info when cancel edit
  const [backupCustomerInfo, setBackupCustomerInfo] = useState<ICustomer>(
    {} as ICustomer,
  );
  const [customerInfo, setCustomerInfo] = useState<ICustomer>({
    purrPetCode: customer?.purrPetCode,
    name: customer?.name,
    email: customer?.email,
    phoneNumber: customer?.phoneNumber,
    address: {
      province: customer?.address?.province || '',
      district: customer?.address?.district || '',
      ward: customer?.address?.ward || '',
      street: customer?.address?.street || '',
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        'https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json',
      );
      setProvinces(response.data);
      if (!customer) {
        navigation.navigate('UnverifyAccountScreen');
      } else if (customer.address) {
        const selectedProvince = response.data.find(
          (province: IProvince) => province.Name === customer.address.province,
        );
        if (selectedProvince) {
          setDistricts(selectedProvince.Districts);
          const selectedDistrict = selectedProvince.Districts.find(
            (district: IDistrict) =>
              district.Name === customer.address.district,
          );
          if (selectedDistrict) {
            setWards(selectedDistrict.Wards);
          }
        }
      }
    };

    fetchData();
  }, []);

  // useEffect(() => {
  //   console.log('customer', customer);
  //   console.log('cusInfo', customerInfo);
  //   // setCustomerInfo({
  //   //   purrPetCode: customer?.purrPetCode,
  //   //   name: customer?.name,
  //   //   email: customer?.email,
  //   //   phoneNumber: customer?.phoneNumber,
  //   //   address: {
  //   //     province: customer?.address?.province || '',
  //   //     district: customer?.address?.district || '',
  //   //     ward: customer?.address?.ward || '',
  //   //     street: customer?.address?.street || '',
  //   //   },
  //   // });
  // }, [customer]);

  // useEffect(() => {
  //   console.log('customerInfo', customerInfo);
  // }, [customerInfo]);

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

  const handleChangeCustomerInfo = (key: string, value: string) => {
    if (key === 'phoneNumber') {
      if (value.length > 10) {
        setError({ message: 'Số điện thoại không hợp lệ', status: true });
        return;
      }
    }

    if (key === 'name') {
      if (value.length > 50) {
        setError({ message: 'Tên không hợp lệ', status: true });
        return;
      }
    }

    setCustomerInfo({
      ...customerInfo,
      [key]: value,
    });
  };

  const handleEditInfo = () => {
    setBackupCustomerInfo(customerInfo);
    setEditInfo(true);
  };

  const handleCancelEditInfo = () => {
    setCustomerInfo(backupCustomerInfo);
    setEditInfo(false);
  };

  const handleSaveInfo = () => {
    console.log('save info', customerInfo);
    updateCustomer(customerInfo);
    setEditInfo(false);
  };

  return (
    <SafeAreaView style={viewStyles.container}>
      <View style={viewStyles.titlePageBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeftIcon />
        </TouchableOpacity>
        <Text style={textStyles.title}>Thông tin tài khoản</Text>
      </View>
      <View style={viewStyles.card}>
        {!editInfo && (
          <>
            <View style={viewStyles.flexRow}>
              <Text style={textStyles.label}>Tên khách hàng: </Text>
              <Text style={textStyles.normal}>{customerInfo.name}</Text>
            </View>
            <View style={viewStyles.flexRow}>
              <Text style={textStyles.label}>Email: </Text>
              <Text style={textStyles.normal}>{customerInfo.email}</Text>
            </View>
            <View style={viewStyles.flexRow}>
              <Text style={textStyles.label}>Số điện thoại: </Text>
              <Text style={textStyles.normal}>{customerInfo.phoneNumber}</Text>
            </View>

            <View style={viewStyles.flexRow}>
              <Text style={textStyles.label}>Địa chỉ: </Text>
              {customer.address?.province && (
                <Text style={textStyles.normal}>
                  {customerInfo.address.street}, {customerInfo.address.ward},{' '}
                  {customerInfo.address.district},{' '}
                  {customerInfo.address.province}
                </Text>
              )}
              {!customerInfo.address?.province && (
                <Text style={textStyles.normal}>Chưa có thông tin địa chỉ</Text>
              )}
            </View>
            <View style={buttonStyles.buttonWrapper}>
              <TouchableOpacity
                style={buttonStyles.button}
                onPress={() => handleEditInfo()}
              >
                <Text style={buttonStyles.buttonText}>Chỉnh sửa</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
        {editInfo && (
          <>
            <View>
              <Text style={textStyles.label}>Tên khách hàng: </Text>
              <TextInput
                style={textInputStyles.textInputBorder}
                value={customerInfo.name}
                onChangeText={(value) => {
                  handleChangeCustomerInfo('name', value);
                }}
                editable={editInfo}
              />
            </View>
            <View style={viewStyles.flexRow}>
              <Text style={textStyles.label}>Email: </Text>
              <Text style={textStyles.normal}>{customerInfo.email}</Text>
            </View>
            <View>
              <Text style={textStyles.label}>Số điện thoại: </Text>
              <TextInput
                style={textInputStyles.textInputBorder}
                value={customerInfo.phoneNumber}
                onChangeText={(value) => {
                  handleChangeCustomerInfo('phoneNumber', value);
                }}
                editable={editInfo}
              />
            </View>
            <View>
              <Text style={textStyles.label}>Địa chỉ: </Text>
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
                <Text style={textStyles.miniLabel}>Quận/Huyện:</Text>
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
                <Text style={textStyles.miniLabel}>Phường/Xã:</Text>
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
                <Text style={textStyles.miniLabel}>Đường:</Text>
                <TextInput
                  style={textInputStyles.textInputBorder}
                  value={customerInfo.address?.street}
                  onChangeText={(value) => {
                    handleChangeStreet(value);
                  }}
                  editable={editInfo}
                />
              </View>
              <View className='flex flex-row justify-between'>
                <TouchableOpacity
                  style={buttonStyles.button}
                  onPress={() => handleCancelEditInfo()}
                >
                  <Text style={buttonStyles.buttonText}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={buttonStyles.button}
                  onPress={() => handleSaveInfo()}
                >
                  <Text style={buttonStyles.buttonText}>Lưu thông tin</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default AccountInfoScreen;
