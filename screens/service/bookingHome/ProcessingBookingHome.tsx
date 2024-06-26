import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import { useCustomerStore } from '../../../zustand/customerStore';
import { useEffect, useRef, useState } from 'react';
import {
  ChevronLeftIcon,
  CircleIcon,
  Icon,
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  Switch,
  Textarea,
  TextareaInput,
} from '@gluestack-ui/themed';
import textStyles from '../../styles/TextStyles';
import viewStyles from '../../styles/ViewStyles';
import { createBookingHome } from '../../../api/bookingHome';
import CustomerInfoForm from '../CustomerInfoForm';
import { formatCurrency, formatDateTime } from '../../../utils/formatData';
import textInputStyles from '../../styles/TextInputStyles';
import { createPaymentUrl } from '../../../api/pay';
import openInChrome from '../../../utils/openInChrome';
import { PAYMENT_METHOD } from '../../constants';
import { socket } from '../../../socket';
import { Socket } from 'socket.io-client';
import * as CONST from '../../constants';

const ProcessingBookingHome = ({ navigation, route }: any) => {
  const { bookingInfo } = route.params;
  const [customerNote, setCustomerNote] = useState('');
  const customer = useCustomerStore((state) => state.customerState.data);
  const hasCustomerInfo = Object.keys(customer).length > 0;
  const [userPoint, setUserPoint] = useState(0);
  const [error, setError] = useState({ point: '' });
  const [payMethod, setPayMethod] = useState(CONST.PAYMENT_METHOD.VNPAY);
  const [showCoin, setShowCoin] = useState(0);
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
      const total = bookingInfo.bookingHomePrice - userPoint;
      if (total > customer.coin) {
        setShowCoin(customer.coin);
      } else {
        setShowCoin(total);
      }
    };
    fetchData();
  }, [bookingInfo]);

  const handleChangeNote = (event: any) => {
    setCustomerNote(event);
  };
  const handleBooking = () => {
    createBookingHome({
      petName: bookingInfo.petName,
      homeCode: bookingInfo.homeCode,
      bookingHomePrice: bookingInfo.bookingHomePrice,
      customerCode: customer.purrPetCode,
      customerNote: customerNote,
      dateCheckIn: bookingInfo.dateCheckIn,
      dateCheckOut: bookingInfo.dateCheckOut,
      userPoint: userPoint,
      payMethod: payMethod,
      useCoin: coin,
    }).then((res) => {
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
          console.log('Đặt hàng thành công!');
          navigation.navigate('Sản phẩm');
        }
      } else {
        console.log(res);
      }
    });
  };
  const handleChangePoint = (event: any) => {
    if (event <= bookingInfo.bookingHomePrice / 10) {
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
    const total = bookingInfo.bookingHomePrice - userPoint - showCoin;
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
          <>
            <View style={{ margin: 10, marginTop: 0 }}>
              <View
                style={{
                  paddingBottom: 20,
                  paddingTop: 20,
                }}
              >
                <Text style={textStyles.labelCenter}>Nội dung đặt lịch</Text>
                <View
                  style={[
                    viewStyles.flexRow,
                    { justifyContent: 'space-between' },
                  ]}
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
                <View
                  style={[
                    viewStyles.flexRow,
                    { justifyContent: 'flex-start', marginTop: 10 },
                  ]}
                >
                  <Text style={textStyles.label}>Ngày checkin:</Text>
                  <Text style={textStyles.normal}>
                    {formatDateTime(bookingInfo.dateCheckIn)}
                  </Text>
                </View>
                <View
                  style={[
                    viewStyles.flexRow,
                    { justifyContent: 'flex-start', marginTop: 10 },
                  ]}
                >
                  <Text style={textStyles.label}>Ngày checkout:</Text>
                  <Text style={textStyles.normal}>
                    {formatDateTime(bookingInfo.dateCheckOut)}
                  </Text>
                </View>
              </View>
              <View>
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
                {customer.coin > 0 && (
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
                    onChangeText={(event) => handleChangeNote(event)}
                  />
                </Textarea>
              </View>
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
                    Ví xu ({formatCurrency(customer.coin)})
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
                <Text style={[textStyles.label]}>Tổng tiền dịch vụ:</Text>
                <Text style={[textStyles.normal]}>
                  {formatCurrency(bookingInfo.bookingHomePrice) || 0}
                </Text>
              </View>
              <View
                style={{ marginTop: 10, padding: 10, backgroundColor: '#fff' }}
              >
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
                  <Text style={[textStyles.normal]}>Sử dụng ví xu:</Text>
                  <Text style={[textStyles.normal]}>
                    -{formatCurrency(coin) || 0}
                  </Text>
                </View>
              </View>
            </View>
          </>
        )}
      </ScrollView>
      {hasCustomerInfo && (
        <TouchableOpacity
          style={{
            backgroundColor: 'pink',
            height: 60,
            justifyContent: 'center',
            marginTop: 10,
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
            {formatCurrency(bookingInfo.bookingHomePrice - userPoint - coin)}
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
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#fff',
  },
});
export default ProcessingBookingHome;
