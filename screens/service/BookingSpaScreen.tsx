import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';
import { useState } from 'react';
import CustomerInfoForm from './CustomerInfoForm';

import {
  ChevronLeftIcon,
  CircleIcon,
  Icon,
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
} from '@gluestack-ui/themed';
import textStyles from '../styles/TextStyles';
import textInputStyles from '../styles/TextInputStyles';
import * as CONST from '../constants';
import { Category } from '../../interface/Category';
import { useEffect } from 'react';
import { getActiveCategories } from '../../api/category';
import { getActiveSpas } from '../../api/spa';
import buttonStyles from '../styles/ButtonStyles';
import TimeSpaForm from './TimeSpaForm';
import { createBookingSpa } from '../../api/bookingSpa';
import { validateObject } from '../../utils/validationData';

const BookingSpaScreen = ({ route, navigation }: any) => {
  const [error, setError] = useState({
    petName: '',
    petType: '',
    size: '',
    spaName: '',
    bookingDate: '',
    bookingTime: '',
  });
  const [message, setMessage] = useState('');
  const [categories, setCategories] = useState([{} as Category]);
  const [allSpas, setAllSpas] = useState([
    {
      purrPetCode: '',
      spaName: '',
      spaType: '',
      categoryCode: '',
      price: 0,
    },
  ]);
  const [validSpas, setValidSpas] = useState([
    {
      purrPetCode: '',
      spaName: '',
      spaType: '',
      categoryCode: '',
      price: 0,
    },
  ]);
  const [validSize, setValidSize] = useState<string[]>([]);
  const [openTimeForm, setOpenTimeForm] = useState(false);
  const [openCustomerInfoForm, setOpenCustomerInfoForm] = useState(false);
  const [showBtnConfirmBook, setShowBtnConfirmBook] = useState(false);
  const [bookingInfo, setBookingInfo] = useState({
    petName: '',
    petType: '',
    size: '',
    spaName: '',
    spaCode: '',
    bookingSpaPrice: 0,
    customerCode: '',
    customerNote: '',
    bookingDate: '',
    bookingTime: '',
  });

  useEffect(() => {
    getActiveCategories({
      categoryType: CONST.CATEGORY_TYPE.SPA,
    }).then((res) => {
      // console.log(res.data);
      setCategories(res.data);
    });
    getActiveSpas().then((res) => {
      // console.log(res.data);
      setAllSpas(res.data);
    });
  }, []);

  const handleChangeBookingInfo = (value: any, field: string) => {
    setError({ ...error, [field]: false });
    if (!value) {
      setError({ ...error, [field]: true });
    }
    if (field === 'spaName') {
      const spa = validSpas.find((spa) => spa.spaName === value);
      if (spa) {
        setBookingInfo({
          ...bookingInfo,
          spaCode: spa.purrPetCode,
          bookingSpaPrice: spa.price,
          spaName: spa.spaName,
        });
      }
    } else if (field === 'petType') {
      let validSpa = allSpas.filter((spa) => spa.spaType === value);
      const validSizes: string[] = [];
      validSpa.forEach((spa) => {
        const category = categories.find(
          (category) => category.purrPetCode === spa.categoryCode,
        );
        if (!category) return;
        if (!validSizes.includes(category.categoryName)) {
          validSizes.push(category.categoryName);
        }
      });
      if (
        (!validSize.includes(bookingInfo.size) && bookingInfo.size !== '') ||
        bookingInfo.size !== ''
      ) {
        const size = categories.find(
          (category) => category.categoryName === bookingInfo.size,
        );
        if (!size) return;
        validSpa = allSpas.filter(
          (spa) =>
            spa.spaType === value && spa.categoryCode === size.purrPetCode,
        );
      }

      setValidSize(validSizes);
      setValidSpas(validSpa);
      setBookingInfo({
        ...bookingInfo,
        petType: value,
        spaName: '',
        size: '',
        bookingSpaPrice: 0,
      });
    } else if (field === 'size') {
      const size = categories.find(
        (category) => category.categoryName === value,
      );
      if (!size) return;
      setValidSpas(
        allSpas.filter(
          (spa) =>
            spa.categoryCode === size.purrPetCode &&
            spa.spaType === bookingInfo.petType,
        ),
      );
      setBookingInfo({
        ...bookingInfo,
        [field]: value,
        spaName: '',
      });
    } else {
      setBookingInfo({
        ...bookingInfo,
        [field]: value,
      });
    }
  };
  const handleOpenTimeForm = () => {
    if (!bookingInfo.petName) {
      setError({ ...error, petName: 'Tên thú cưng không được để trống!' });
      return;
    }
    setOpenTimeForm(true);
  };
  const handleUpdateBookingInfo = (bookingInfo: any) => {
    setBookingInfo(bookingInfo);
    console.log(bookingInfo);
  };
  const handleCustomerInfo = (customerInfo: any) => {
    setBookingInfo({
      ...bookingInfo,
      customerCode: customerInfo.customerCode,
      customerNote: customerInfo.customerNote,
    });
  };

  const handleConfirmInfo = (confirm: any) => {
    setShowBtnConfirmBook(confirm);
  };

  const handleConfirmBooking = () => {
    setShowBtnConfirmBook(false);
    console.log('book', bookingInfo);
    createBookingSpa({
      petName: bookingInfo.petName,
      spaCode: bookingInfo.spaCode,
      bookingSpaPrice: bookingInfo.bookingSpaPrice,
      customerCode: bookingInfo.customerCode,
      customerNote: bookingInfo.customerNote,
      bookingDate: bookingInfo.bookingDate,
      bookingTime: bookingInfo.bookingTime,
    }).then((res) => {
      console.log(res);
      if (res.err === 0) {
        // navigate(`/bookingSpa/${res.data.purrPetCode}`);
        // navigate("/");
        console.log('booking success');
        setTimeout(() => {
          navigation.goBack();
        }, 1000);
      }
      setMessage(res.message);
    });
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          backgroundColor: '#FDE047',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 50,
          paddingRight: 100,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon as={ChevronLeftIcon} size='xl' color='#B91C1C' />
        </TouchableOpacity>
        <Text style={textStyles.title}>Thông tin đặt lịch spa</Text>
      </View>
      <ScrollView>
        <View style={styles.infoPet}>
          <Text style={textStyles.labelCenter}>Thông tin thú cưng</Text>
          <TextInput
            placeholder='Tên thú cưng'
            style={textInputStyles.textInputBorder}
            value={bookingInfo.petName}
            onChangeText={(text) => handleChangeBookingInfo(text, 'petName')}
          />
          <Text style={textStyles.error}>
            {error.petName ? error.petName : ''}
          </Text>
          <View style={{ marginTop: 5 }}>
            <Text style={textStyles.label}>Thú cưng là:</Text>
            <RadioGroup
              value={bookingInfo.petType}
              style={{ flexDirection: 'row' }}
              onChange={(value) => handleChangeBookingInfo(value, 'petType')}
            >
              {Object.values(CONST.PET_TYPE).map((value, index) => (
                <Radio
                  value={value}
                  size='sm'
                  style={{ marginRight: 30 }}
                  key={index}
                >
                  <RadioIndicator mr='$2'>
                    <RadioIcon as={CircleIcon} />
                  </RadioIndicator>
                  <RadioLabel>{value}</RadioLabel>
                </Radio>
              ))}
            </RadioGroup>
          </View>
          <View>
            {bookingInfo.petType && (
              <View style={{ marginTop: 5 }}>
                <Text style={textStyles.label}>Cân nặng của thú cưng:</Text>
                <RadioGroup
                  value={bookingInfo.size}
                  style={{ flexDirection: 'row' }}
                  onChange={(value) => handleChangeBookingInfo(value, 'size')}
                >
                  {validSize &&
                    validSize.map((value, index) => (
                      <Radio
                        value={value}
                        size='sm'
                        style={{ marginRight: 5 }}
                        key={index}
                      >
                        <RadioIndicator mr='$2'>
                          <RadioIcon as={CircleIcon} />
                        </RadioIndicator>
                        <RadioLabel>{value}</RadioLabel>
                      </Radio>
                    ))}
                </RadioGroup>
              </View>
            )}
          </View>
          {bookingInfo.size && (
            <View style={{ marginTop: 5 }}>
              <Text style={textStyles.label}>Chọn gói dịch vụ:</Text>
              <RadioGroup
                value={bookingInfo.spaName}
                style={{ flexDirection: 'row' }}
                onChange={(value) => handleChangeBookingInfo(value, 'spaName')}
              >
                {validSpas &&
                  validSpas.map((value, index) => (
                    <Radio
                      value={value.spaName}
                      size='sm'
                      style={{ marginRight: 5 }}
                      key={index}
                    >
                      <RadioIndicator mr='$2'>
                        <RadioIcon as={CircleIcon} />
                      </RadioIndicator>
                      <RadioLabel>{value.spaName}</RadioLabel>
                    </Radio>
                  ))}
              </RadioGroup>
            </View>
          )}
          {bookingInfo.spaName && (
            <View>
              <Text
                style={{
                  alignSelf: 'flex-end',
                  margin: 5,
                  fontSize: 14,
                  fontWeight: 'bold',
                  color: '#000',
                }}
              >
                Tổng tiền: {bookingInfo.bookingSpaPrice}
              </Text>
              {!openTimeForm && (
                <TouchableOpacity
                  style={buttonStyles.buttonConfirm}
                  onPress={() => handleOpenTimeForm()}
                >
                  <Text
                    style={{
                      color: '#fff',
                      fontWeight: 'bold',
                      alignSelf: 'center',
                    }}
                  >
                    Tiếp tục
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          {openTimeForm && (
            <TimeSpaForm
              bookingInfo={bookingInfo}
              setOpenCustomerInfoForm={setOpenCustomerInfoForm}
              updateBookingInfo={handleUpdateBookingInfo}
            />
          )}
          {openCustomerInfoForm && (
            <CustomerInfoForm
              customer={handleCustomerInfo}
              confirmInfo={handleConfirmInfo}
            />
          )}
          {showBtnConfirmBook && (
            <TouchableOpacity
              style={buttonStyles.buttonConfirm}
              onPress={handleConfirmBooking}
            >
              <Text
                style={{
                  color: '#FFF',
                  fontWeight: 'bold',
                  alignSelf: 'center',
                }}
              >
                Xác nhận đặt lịch
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  infoPet: {
    margin: 20,
  },
  datePickerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    paddingRight: 10,
  },
});
export default BookingSpaScreen;
