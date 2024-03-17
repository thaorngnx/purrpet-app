import {
  Icon,
  ChevronLeftIcon,
  RadioGroup,
  RadioIcon,
  CircleIcon,
  Radio,
  RadioIndicator,
  RadioLabel,
  set,
} from '@gluestack-ui/themed';
import React from 'react';
import { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import textStyles from '../styles/TextStyles';
import textInputStyles from '../styles/TextInputStyles';
import * as CONST from '../constants';
import { useEffect } from 'react';
import { getActiveCategories } from '../../api/category';
import { getMasterDatas } from '../../api/masterData';
import { createBookingHome, getUnavailableDay } from '../../api/bookingHome';
import { getActiveHomestays } from '../../api/homestay';
import { Homestay } from '../../interface/Homestay';
import { BookingHomeInfo } from '../../interface/BookingHome';
import dayjs, { Dayjs } from 'dayjs';
import { CalendarDays } from 'lucide-react-native';
import CalendarPicker from 'react-native-calendar-picker';
import CustomerInfoForm from './CustomerInfoForm';
import ButtonStyles from '../styles/ButtonStyles';
import { getActiveProducts } from '../../api/product';
import { flags } from 'realm';
import { createPaymentUrl } from '../../api/pay';
import openInChrome from '../../utils/openInChrome';
import * as WebBrowser from 'expo-web-browser';

const BookingHomeScreen = ({ navigation }: any) => {
  const [error, setError] = useState({
    petName: '',
    petType: '',
    category: '',
    homeSize: '',
    message: '',
  });
  const [message, setMessage] = useState('');
  const [categories, setCategories] = useState([
    {
      categoryName: '',
      purrPetCode: '',
    },
  ]);
  const [allHomes, setAllHomes] = useState([{} as Homestay]);
  const [validHomes, setValidHomes] = useState<Homestay[]>([]);
  const [openCustomerInfoForm, setOpenCustomerInfoForm] = useState(false);
  const [showBtnConfirmBook, setShowBtnConfirmBook] = useState(false);
  const [homeSizes, setHomeSizes] = useState([
    {
      name: '',
      purrPetCode: '',
      groupCode: '',
      status: '',
    },
  ]);
  const [validSizes, setValidSizes] = useState<string[]>([]);
  const [unavailableDays, setUnavailableDays] = useState<string[]>([]);
  const [maxDateCheckOut, setMaxDateCheckOut] = useState(
    dayjs().add(2, 'year'),
  );
  const [bookingInfo, setBookingInfo] = useState({} as BookingHomeInfo);
  const [showDatePickerCheckin, setShowDatePickerCheckin] = useState(false);
  const [showDatePickerCheckout, setShowDatePickerCheckout] = useState(false);
  const [dateCheckin, setDateCheckin] = useState('');
  const [dateCheckout, setDateCheckout] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  useEffect(() => {
    getActiveCategories({
      categoryType: CONST.CATEGORY_TYPE.HOMESTAY,
    }).then((res) => {
      // console.log(res.data);
      setCategories(res.data);
    });
    getActiveHomestays({}).then((res) => {
      // console.log(res.data);
      setAllHomes(res.data);
    });
    getMasterDatas({ groupCode: CONST.GROUP_CODE.HOME_SIZE }).then((res) => {
      // console.log(res.data);
      setHomeSizes(res.data);
    });
  }, []);

  const handleChangeBookingInfo = (value: any, field: string) => {
    if (field === 'category') {
      const selectedCategory = categories.find(
        (category) => category.categoryName === value,
      );
      if (selectedCategory) {
        const validHome = allHomes.filter(
          (home) =>
            home.categoryCode === selectedCategory.purrPetCode &&
            home.homeType === bookingInfo.petType,
        );
        setValidHomes(validHome);

        const validSizes: string[] = [];
        validHome.forEach((home) => {
          const size = homeSizes.find(
            (size) => size.purrPetCode === home.masterDataCode,
          );
          if (size && !validSizes.includes(size.name)) {
            validSizes.push(size.name);
          }
        });
        if (validSizes.length === 0) {
          setError({ ...error, category: 'Không có phòng phù hợp' });
        } else {
          setValidSizes(validSizes);
          setBookingInfo({
            ...bookingInfo,
            categoryName: value,
            categoryCode: selectedCategory?.purrPetCode,
            homeSize: '',
          });
        }
      } else {
        setBookingInfo({
          ...bookingInfo,
          categoryName: value,
          categoryCode: '',
          homeSize: '',
        });
      }
    } else if (field === 'homeSize') {
      const masterData = homeSizes.find((size) => size.name === value);
      if (!masterData) {
        setError({ ...error, homeSize: 'Không có phòng phù hợp' });
        return;
      }
      const home = validHomes.find(
        (home) =>
          home.masterDataCode === masterData.purrPetCode &&
          home.homeType === bookingInfo.petType &&
          home.categoryCode === bookingInfo.categoryCode,
      );
      if (!home) {
        setError({ ...error, homeSize: 'Không có phòng phù hợp' });
        return;
      }
      getUnavailableDay({
        masterDataCode: masterData.purrPetCode,
      }).then((res) => {
        if (res.err === 0) {
          setUnavailableDays(res.data);
        } else {
          setUnavailableDays([]);
        }
      });
      setBookingInfo({
        ...bookingInfo,
        homeCode: home.purrPetCode,
        homePrice: home.price,
        bookingHomePrice: home.price,
        homeSize: masterData.name,
      });
    } else {
      setBookingInfo({ ...bookingInfo, [field]: value });
    }
  };
  const handleChangeDateCheckin = (date: Date) => {
    console.log(date);
    setSelectedDate(date);
    const newDate = dayjs(date);

    let checkOut = dayjs(bookingInfo.dateCheckOut);
    if (newDate.isAfter(checkOut) || newDate.isSame(checkOut)) {
      checkOut = dayjs(null);
      setDateCheckout('');
    }
    let maxDateCheckOut = dayjs().add(2, 'year');
    unavailableDays.forEach((day) => {
      if (dayjs(day).isAfter(newDate) && dayjs(day).isBefore(maxDateCheckOut)) {
        maxDateCheckOut = dayjs(day);
      }
    });

    setDateCheckin(dayjs(date).format('DD/MM/YYYY'));
    setMaxDateCheckOut(maxDateCheckOut);
    countDateAndPrice(newDate, checkOut);
    setShowDatePickerCheckin(false);
  };
  const handleChangeDateCheckout = (date: Date) => {
    setBookingInfo({ ...bookingInfo, dateCheckOut: date });
    setDateCheckout(dayjs(date).format('DD/MM/YYYY'));
    countDateAndPrice(bookingInfo.dateCheckIn, dayjs(date));
    setShowDatePickerCheckout(false);
  };
  const countDateAndPrice = (dateCheckIn: Dayjs, dateCheckOut: Dayjs) => {
    let price = bookingInfo.homePrice;
    if (dayjs(dateCheckOut).isValid()) {
      let diff = dateCheckOut.diff(dateCheckIn, 'day');
      console.log(diff);
      price = diff * bookingInfo.homePrice;
    }
    setBookingInfo({
      ...bookingInfo,
      dateCheckIn: dateCheckIn,
      dateCheckOut: dayjs(dateCheckOut).isValid() ? dateCheckOut : null,
      bookingHomePrice: price,
    });
  };
  const handleClickContinue = () => {
    if (bookingInfo.petName === undefined) {
      setError({ ...error, petName: 'Tên thú cưng không được để trống!' });
      return;
    }
    setError({ ...error, petName: '' });
    setOpenCustomerInfoForm(true);
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
    if (bookingInfo.petName === undefined) {
      setError({ ...error, petName: 'Tên thú cưng không được để trống!' });
      return;
    }
    //setShowBtnConfirmBook(false);
    createBookingHome({
      petName: bookingInfo.petName,
      homeCode: bookingInfo.homeCode,
      bookingHomePrice: bookingInfo.bookingHomePrice,
      customerCode: bookingInfo.customerCode,
      customerNote: bookingInfo.customerNote,
      dateCheckIn: bookingInfo.dateCheckIn,
      dateCheckOut: bookingInfo.dateCheckOut,
    }).then((res) => {
      if (res.err === 0) {
        createPaymentUrl({
          orderCode: res.data.purrPetCode,
        }).then((res) => {
          if (res.err === 0) {
            WebBrowser.openBrowserAsync(res.data.paymentUrl, {
              showTitle: true,
            });
          }
        });
      } else {
        setError({ ...error, message: res.msg });
      }
    });
  };
  return (
    <SafeAreaView>
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
        <Text style={textStyles.title}>Thông tin đặt phòng</Text>
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
          {bookingInfo.petType && (
            <View style={{ marginTop: 5 }}>
              <Text style={textStyles.label}>Bạn muốn đặt phòng:</Text>
              <RadioGroup
                value={bookingInfo.categoryName}
                style={{ flexDirection: 'row' }}
                onChange={(value) => handleChangeBookingInfo(value, 'category')}
              >
                {categories &&
                  categories.map((category, index) => (
                    <Radio
                      value={category.categoryName}
                      size='sm'
                      style={{ marginRight: 30 }}
                      key={index}
                    >
                      <RadioIndicator mr='$2'>
                        <RadioIcon as={CircleIcon} />
                      </RadioIndicator>
                      <RadioLabel>{category.categoryName}</RadioLabel>
                    </Radio>
                  ))}
              </RadioGroup>
            </View>
          )}
          {bookingInfo.categoryCode && (
            <View style={{ marginTop: 5 }}>
              <Text style={textStyles.label}>Chọn loại phòng:</Text>
              <RadioGroup
                value={bookingInfo.homeSize}
                style={{ flexDirection: 'row' }}
                onChange={(value) => handleChangeBookingInfo(value, 'homeSize')}
              >
                {validSizes &&
                  validSizes.map((size, index) => (
                    <Radio
                      value={size}
                      size='sm'
                      style={{ marginRight: 30 }}
                      key={index}
                    >
                      <RadioIndicator mr='$2'>
                        <RadioIcon as={CircleIcon} />
                      </RadioIndicator>
                      <RadioLabel>{size}</RadioLabel>
                    </Radio>
                  ))}
              </RadioGroup>
            </View>
          )}
          {bookingInfo.homeSize && (
            <View>
              <View style={{ marginTop: 5 }}>
                <Text style={textStyles.label}>Chọn ngày đến:</Text>

                <TouchableOpacity
                  style={styles.datePickerStyle}
                  onPress={() => {
                    setShowDatePickerCheckin(true);
                    setShowDatePickerCheckout(false);
                  }}
                >
                  <TextInput
                    style={{
                      width: '90%',
                      color: '#000000',
                      fontSize: 16,
                    }}
                    placeholder='Ngày vào'
                    value={dateCheckin}
                    editable={false}
                  />
                  <CalendarDays size={32} color='#000000' />
                </TouchableOpacity>
                {showDatePickerCheckin && (
                  <CalendarPicker
                    onDateChange={handleChangeDateCheckin}
                    disabledDates={unavailableDays.map((day) => new Date(day))}
                    minDate={new Date()}
                  />
                )}
              </View>
              {bookingInfo.dateCheckIn && (
                <View style={{ marginTop: 5 }}>
                  <Text style={textStyles.label}>Chọn ngày ra:</Text>

                  <TouchableOpacity
                    style={styles.datePickerStyle}
                    onPress={() => {
                      setShowDatePickerCheckout(true);
                      setShowDatePickerCheckin(false);
                    }}
                  >
                    <TextInput
                      style={{
                        width: '90%',
                        color: '#000000',
                        fontSize: 16,
                      }}
                      placeholder='Ngày ra'
                      value={dateCheckout}
                      editable={false}
                    />
                    <CalendarDays size={32} color='#000000' />
                  </TouchableOpacity>
                  {showDatePickerCheckout && (
                    <CalendarPicker
                      onDateChange={handleChangeDateCheckout}
                      minDate={dayjs(bookingInfo.dateCheckIn)
                        .add(1, 'day')
                        .toDate()}
                      disabledDates={(date) => {
                        return unavailableDays.some(
                          (day) =>
                            dayjs(date).isSame(
                              dayjs(bookingInfo.dateCheckIn),
                            ) && dayjs(date).isSame(dayjs(day).add(1, 'day')),
                        );
                      }}
                      maxDate={maxDateCheckOut.toDate()}
                    />
                  )}
                </View>
              )}
            </View>
          )}
          <View style={{ alignSelf: 'flex-end', marginTop: 5 }}>
            {bookingInfo.dateCheckIn && bookingInfo.dateCheckOut !== null && (
              <Text style={textStyles.label}>
                Giá phòng: {bookingInfo.bookingHomePrice} VND
              </Text>
            )}
          </View>
          <View>
            {bookingInfo.dateCheckIn &&
              bookingInfo.dateCheckOut &&
              !openCustomerInfoForm && (
                <TouchableOpacity
                  style={ButtonStyles.button}
                  onPress={() => handleClickContinue()}
                >
                  <Text style={{ color: '#FFFFFF', textAlign: 'center' }}>
                    Tiếp tục
                  </Text>
                </TouchableOpacity>
              )}
          </View>
          {openCustomerInfoForm && (
            <CustomerInfoForm
              customer={handleCustomerInfo}
              confirmInfo={handleConfirmInfo}
            />
          )}

          {showBtnConfirmBook && (
            <TouchableOpacity
              style={{
                backgroundColor: '#B91C1C',
                padding: 10,
                borderRadius: 5,
                marginTop: 10,
              }}
              onPress={() => handleConfirmBooking()}
            >
              <Text style={{ color: '#FFFFFF', textAlign: 'center' }}>
                Đặt phòng
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

export default BookingHomeScreen;
