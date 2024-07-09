import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import CustomerInfoForm from '../CustomerInfoForm';
import textStyles from '../../styles/TextStyles';
import { ChevronLeftIcon, CircleIcon } from 'lucide-react-native';
import {
  Icon,
  RadioGroup,
  RadioIndicator,
  Radio,
  Switch,
  Textarea,
  TextareaInput,
  RadioIcon,
} from '@gluestack-ui/themed';
import viewStyles from '../../styles/ViewStyles';
import React, { useEffect, useRef, useState } from 'react';
import { useCustomerStore } from '../../../zustand/customerStore';
import { formatCurrency } from '../../../utils/formatData';
import textInputStyles from '../../styles/TextInputStyles';
import openInChrome from '../../../utils/openInChrome';
import { createPaymentUrl } from '../../../api/pay';
import { createBookingSpa } from '../../../api/bookingSpa';
import { socket } from '../../../socket';
import { Socket } from 'socket.io-client';
import { StyleSheet } from 'react-native';
import * as CONST from '../../constants';
import { getCustomerById } from '../../../api/customer';

const ProcessingBookingSpa = ({ navigation, route }: any) => {
  const { bookingInfo } = route.params;
  const [customerNote, setCustomerNote] = useState('');
  const customer = useCustomerStore((state) => state.customerState.data);
  const hasCustomerInfo = Object.keys(customer).length > 0;
  const [userPoint, setUserPoint] = useState(0);
  const [error, setError] = useState({ point: '' });
  const [payMethod, setPayMethod] = useState(CONST.PAYMENT_METHOD.VNPAY);
  const [showCoin, setShowCoin] = useState(0);
  const [coinforCus, setCoinforCus] = useState(0);
  const [coin, setCoin] = useState(0);
  const [disableRadio, setDisableRadio] = useState({
    VNPAY: false,
    COIN: true,
  });

  const socketRef = useRef<Socket>();

  useEffect(() => {
    if (hasCustomerInfo) {
      const accessToken = customer.accessToken;
      const socketClient = socket(accessToken);
      socketRef.current = socketClient;

      function onTradeEvent(value: any) {
        navigation.navigate('Sản phẩm');
      }

      socketClient.on('connect', () => {
        console.log('socket connected');
      });

      socketClient.on(accessToken, onTradeEvent);

      return () => {
        socketClient.off(accessToken, onTradeEvent);
      };
    }
  }, [customer]);
  useEffect(() => {
    const fetchData = async () => {
      const res = await getCustomerById();
      const coinforCus = res.data.coin;
      setCoinforCus(coinforCus);
      const total = bookingInfo.bookingSpaPrice - userPoint;
      if (total > coinforCus) {
        setShowCoin(coinforCus);
      } else {
        setShowCoin(total);
      }
    };
    fetchData();
  }, [userPoint, bookingInfo.bookingSpaPrice, coinforCus]);

  const handleChangeNote = (event: any) => {
    setCustomerNote(event);
  };
  const handleBooking = () => {
    createBookingSpa({
      petName: bookingInfo.petName,
      spaCode: bookingInfo.spaCode,
      bookingSpaPrice: bookingInfo.bookingSpaPrice,
      customerCode: customer.purrPetCode,
      customerNote: customerNote,
      bookingDate: bookingInfo.bookingDate,
      bookingTime: bookingInfo.bookingTime,
      userPoint: userPoint,
      useCoin: coin,
      payMethod: payMethod,
    }).then((res) => {
      if (res) {
        if (res.err == 0) {
          if (payMethod === CONST.PAYMENT_METHOD.VNPAY) {
            createPaymentUrl({
              orderCode: res.data.purrPetCode,
              returnUrl: '/vnpay-returnForMoblie',
            }).then((res) => {
              if (res.err === 0) {
                console.log('Đặt hàng thành công!');
                openInChrome(res.data.paymentUrl, navigation, customer);
              }
            });
          } else {
            navigation.navigate('Sản phẩm');
          }
        } else {
          console.log(res);
        }
      }
    });
  };
  const handleChangePoint = (event: any) => {
    if (event <= bookingInfo.bookingSpaPrice / 10) {
      if (event > customer.point) {
        console.log('Số điểm không đủ');
        setError({
          ...error,
          point: 'Số điểm không đủ',
        });
      } else {
        setError({
          ...error,
          point: '',
        });
        setUserPoint(event);
      }
    } else {
      setError({
        ...error,
        point: 'Điểm tối đa có thể sử dụng là 10% giá trị đơn hàng',
      });
    }
  };
  const handleChangeCoin = (event: any) => {
    const total = bookingInfo.bookingSpaPrice - userPoint - showCoin;
    if (event === true) {
      setCoin(showCoin);
      if (total === 0) {
        setPayMethod(CONST.PAYMENT_METHOD.COIN);
        setDisableRadio({
          COIN: false,
          VNPAY: true,
        });
      } else {
        setPayMethod(CONST.PAYMENT_METHOD.VNPAY);
        setDisableRadio({
          VNPAY: false,
          COIN: true,
        });
      }
    } else {
      setCoin(showCoin);
      setPayMethod(CONST.PAYMENT_METHOD.VNPAY);
      setDisableRadio({
        VNPAY: false,
        COIN: true,
      });
    }
  };
  const handlePayment = (value: any) => {
    setPayMethod(value);
    if (value === CONST.PAYMENT_METHOD.COIN) {
      setCoin(showCoin);
    }
  };
  return (
    <SafeAreaView style={viewStyles.container}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#BAE6FD',
          height: 50,
          marginBottom: 10,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon as={ChevronLeftIcon} size='xl' color='#B91C1C' />
        </TouchableOpacity>
        <Text style={textStyles.title}>Đặt lịch</Text>
      </View>
      <ScrollView style={style.scrollView}>
        <CustomerInfoForm />
        {hasCustomerInfo && (
          <View style={{ margin: 10, marginTop: 0 }}>
            <Text style={textStyles.labelCenter}>Nội dung đặt lịch</Text>
            <View
              style={[viewStyles.flexRow, { justifyContent: 'space-between' }]}
            >
              <View style={viewStyles.flexRow}>
                <Text style={textStyles.label}>Tên thú cưng:</Text>
                <Text style={textStyles.normal}>{bookingInfo.petName}</Text>
              </View>
              <View style={viewStyles.flexRow}>
                <Text style={textStyles.label}>Loại thú cưng:</Text>
                <Text style={textStyles.normal}>{bookingInfo.petType}</Text>
              </View>
            </View>
            <View style={[viewStyles.flexRow, { marginTop: 10 }]}>
              <Text style={textStyles.label}>Loại dịch vụ:</Text>
              <Text style={textStyles.normal}>{bookingInfo.spaName}</Text>
            </View>
            <View style={[viewStyles.flexRow, { marginTop: 10 }]}>
              <Text style={textStyles.label}>Ngày đặt lịch:</Text>
              <Text style={textStyles.normal}>
                {bookingInfo.bookingDate.format('YYYY-MM-DD')}
              </Text>
            </View>
            <View style={[viewStyles.flexRow, { marginTop: 10 }]}>
              <Text style={textStyles.label}>Giờ đặt lịch:</Text>
              <Text style={textStyles.normal}>{bookingInfo.bookingTime}</Text>
            </View>

            <View style={{ marginTop: 10 }}>
              <View
                style={[
                  viewStyles.flexRow,
                  { justifyContent: 'space-between', marginBottom: 10 },
                ]}
              >
                <Text style={textStyles.label}>Dùng điểm tích luỹ</Text>
                <Text style={textStyles.normal}>
                  Số điểm hiện có: {formatCurrency(customer.point)}
                </Text>
              </View>

              <TextInput
                style={textInputStyles.textInputBorder}
                keyboardType='numeric'
                value={userPoint.toString()}
                onChangeText={(event) => handleChangePoint(event)}
              />
              <Text style={textStyles.error}>{error.point}</Text>
              {coinforCus > 0 && (
                <View
                  style={[
                    viewStyles.flexRow,
                    { justifyContent: 'space-around', marginTop: 10 },
                  ]}
                >
                  <Text style={textStyles.label}>
                    Sử dụng xu trong ví để thanh toán
                  </Text>
                  <Switch onValueChange={(e) => handleChangeCoin(e)} />
                  <Text style={textStyles.normal}>
                    {formatCurrency(showCoin)}
                  </Text>
                  <Image
                    source={require('../../../assets/coin.png')}
                    style={{ width: 20, height: 20 }}
                  />
                </View>
              )}
            </View>
            <View>
              <Text style={textStyles.label}>Ghi chú</Text>
              <Textarea
                size='md'
                isReadOnly={false}
                isInvalid={false}
                isDisabled={false}
                w='100%'
                marginTop={10}
              >
                <TextareaInput
                  value={customerNote}
                  placeholder='Ghi chú cho nhân viên cửa hàng'
                  color='black'
                  onChangeText={(event) => handleChangeNote(event)}
                />
              </Textarea>
              <Text style={textStyles.label}>Phương thức thanh toán</Text>
              <RadioGroup
                value={payMethod}
                onChange={(value) => handlePayment(value)}
              >
                <Radio
                  value={CONST.PAYMENT_METHOD.VNPAY}
                  size='sm'
                  style={{ marginTop: 10 }}
                  isDisabled={disableRadio.VNPAY}
                >
                  <RadioIndicator mr='$2'>
                    <RadioIcon as={CircleIcon} />
                  </RadioIndicator>

                  <Image
                    source={require('../../../assets/vnpay.png')}
                    style={{ width: 45, height: 30 }}
                  />
                  <Text style={textStyles.normal}>
                    {CONST.PAYMENT_METHOD.VNPAY}
                  </Text>
                </Radio>
                <Radio
                  value={CONST.PAYMENT_METHOD.COIN}
                  size='sm'
                  style={{ marginTop: 20 }}
                  isDisabled={disableRadio.COIN}
                >
                  <RadioIndicator mr='$2'>
                    <RadioIcon as={CircleIcon} />
                  </RadioIndicator>
                  <Image
                    source={require('../../../assets/coin.png')}
                    style={{ width: 20, height: 20 }}
                  />
                  <Text style={textStyles.normal}>
                    Ví xu ({formatCurrency(coinforCus)})
                  </Text>
                </Radio>
              </RadioGroup>
            </View>
            <View style={{ marginTop: 10 }}>
              <View
                style={[
                  viewStyles.flexRow,
                  { justifyContent: 'space-between' },
                ]}
              >
                <Text style={[textStyles.normal]}>Tổng tiền dịch vụ:</Text>
                <Text style={[textStyles.normal]}>
                  {formatCurrency(bookingInfo.bookingSpaPrice) || 0}
                </Text>
              </View>
              <View
                style={[
                  viewStyles.flexRow,
                  { marginTop: 5, justifyContent: 'space-between' },
                ]}
              >
                <Text style={[textStyles.normal]}>Sử dụng điểm:</Text>
                <Text style={[textStyles.normal]}>
                  -{formatCurrency(userPoint) || 0}
                </Text>
              </View>
              <View
                style={[
                  viewStyles.flexRow,
                  { marginTop: 5, justifyContent: 'space-between' },
                ]}
              >
                <Text style={[textStyles.normal]}>Thanh toán bằng ví xu:</Text>
                <Text style={[textStyles.normal]}>
                  -{formatCurrency(coin) || 0}
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
      {hasCustomerInfo && (
        <TouchableOpacity
          style={{
            backgroundColor: 'pink',
            height: 60,
            justifyContent: 'center',
          }}
          onPress={() => handleBooking()}
        >
          <Text
            style={{
              color: '#000000',
              fontWeight: 'bold',
              alignSelf: 'center',
              fontSize: 17,
            }}
          >
            Thanh toán{' '}
            {formatCurrency(bookingInfo.bookingSpaPrice - userPoint - coin)}
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
});
export default ProcessingBookingSpa;
