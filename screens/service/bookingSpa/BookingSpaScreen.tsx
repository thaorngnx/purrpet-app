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
import textStyles from '../../styles/TextStyles';
import textInputStyles from '../../styles/TextInputStyles';
import * as CONST from '../../constants';
import { Category } from '../../../interface/Category';
import { useEffect } from 'react';
import { getActiveCategories } from '../../../api/category';
import { getActiveSpas } from '../../../api/spa';
import buttonStyles from '../../styles/ButtonStyles';
import TimeSpaForm from './TimeSpaForm';
import { createBookingSpa } from '../../../api/bookingSpa';

const BookingSpaScreen = ({ route, navigation }: any) => {
  const [error, setError] = useState({
    petName: '',
    petType: '',
    size: '',
    spaName: '',
    bookingDate: '',
    bookingTime: '',
  });
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
  // const [showBtnConfirmBook, setShowBtnConfirmBook] = useState(false);
  const [bookingInfo, setBookingInfo] = useState({
    petName: '',
    petType: '',
    size: '',
    spaName: '',
    spaCode: '',
    bookingSpaPrice: 0,
    customerNote: '',
    bookingDate: '',
    bookingTime: '',
  });

  useEffect(() => {
    getActiveCategories({
      categoryType: CONST.CATEGORY_TYPE.SPA,
    }).then((res) => {
      setCategories(res.data);
    });
    getActiveSpas().then((res) => {
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          backgroundColor: '#BAE6FD',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 70,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon as={ChevronLeftIcon} size='xl' color='#B91C1C' />
        </TouchableOpacity>
        <Text style={textStyles.title} className='self-center'>
          Thông tin đặt lịch spa
        </Text>
      </View>
      <ScrollView>
        <View style={styles.infoPet}>
          <View
            style={{
              backgroundColor: '#fff',
              padding: 10,
            }}
          >
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
            <View>
              <Text style={textStyles.label} className='mb-3 '>
                Thú cưng là:
              </Text>
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
                  <Text style={textStyles.label} className='mb-3 mt-3'>
                    Cân nặng của thú cưng:
                  </Text>
                  <RadioGroup
                    value={bookingInfo.size}
                    style={{ flexDirection: 'row', flexWrap: 'wrap' }}
                    onChange={(value) => handleChangeBookingInfo(value, 'size')}
                  >
                    {validSize &&
                      validSize.map((value, index) => (
                        <Radio
                          value={value}
                          size='sm'
                          style={{ marginRight: 8, marginTop: 7 }}
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
                <Text style={textStyles.label} className='mb-3 mt-3'>
                  Chọn gói dịch vụ:
                </Text>
                <RadioGroup
                  value={bookingInfo.spaName}
                  style={{ flexDirection: 'row' }}
                  onChange={(value) =>
                    handleChangeBookingInfo(value, 'spaName')
                  }
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
                    fontSize: 16,
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
          </View>
          {openTimeForm && (
            <TimeSpaForm
              bookingInfo={bookingInfo}
              updateBookingInfo={handleUpdateBookingInfo}
            />
          )}
          {bookingInfo.bookingTime && (
            <TouchableOpacity
              style={buttonStyles.buttonConfirm}
              onPress={() => {
                navigation.navigate('ProcessingBookingSpa', {
                  bookingInfo: bookingInfo,
                });
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  fontWeight: 'bold',
                  alignSelf: 'center',
                  marginTop: 5,
                }}
              >
                Tiếp tục
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
    padding: 10,
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
