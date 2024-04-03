import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { useCustomerStore } from '../../../zustand/customerStore';
import { useState } from 'react';
import {
  ChevronLeftIcon,
  Icon,
  Textarea,
  TextareaInput,
} from '@gluestack-ui/themed';
import textStyles from '../../styles/TextStyles';
import viewStyles from '../../styles/ViewStyles';
import buttonStyles from '../../styles/ButtonStyles';
import { createBookingHome } from '../../../api/bookingHome';
import CustomerInfoForm from '../CustomerInfoForm';
import { formatCurrency } from '../../../utils/formatData';
import textInputStyles from '../../styles/TextInputStyles';
import { createPaymentUrl } from '../../../api/pay';
import openInChrome from '../../../utils/openInChrome';

const ProcessingBookingHome = ({ navigation, route }: any) => {
  const { bookingInfo } = route.params;
  const [customerNote, setCustomerNote] = useState('');
  const customer = useCustomerStore((state) => state.customerState.data);
  const hasCustomerInfo = Object.keys(customer).length > 0;
  const [userPoint, setUserPoint] = useState(0);
  const [error, setError] = useState({ point: '' });

  const handleChangeNote = (event: any) => {
    const { text } = event.nativeEvent;
    setCustomerNote(text);
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
    }).then((res) => {
      if (res) {
        if (res.err == 0) {
          createPaymentUrl({
            orderCode: res.data.purrPetCode,
          }).then((res) => {
            if (res.err === 0) {
              console.log('Đặt hàng thành công!');
              openInChrome(res.data.paymentUrl);
            }
          });
        } else {
          console.log(res);
        }
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
      <ScrollView>
        <CustomerInfoForm />
        {hasCustomerInfo && (
          <View>
            <View
              style={{
                backgroundColor: '#fff',
                margin: 5,
                padding: 5,
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
                <Text style={textStyles.label}>Tên thú cưng:</Text>
                <Text style={textStyles.normal}>{bookingInfo.petName}</Text>
                <Text style={textStyles.label}>Loại thú cưng:</Text>
                <Text style={textStyles.normal}>{bookingInfo.petType}</Text>
              </View>
              <View
                style={[
                  viewStyles.flexRow,
                  { justifyContent: 'flex-start', marginTop: 10 },
                ]}
              >
                <Text style={textStyles.label}>Ngày checkin:</Text>
                <Text style={textStyles.normal}>
                  {bookingInfo.dateCheckIn.format('YYYY-MM-DD')}
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
                  {bookingInfo.dateCheckOut.format('YYYY-MM-DD')}
                </Text>
              </View>
            </View>
            <View style={{ margin: 10, padding: 5, backgroundColor: '#fff' }}>
              <View
                style={[
                  viewStyles.flexRow,
                  { justifyContent: 'space-around', marginBottom: 10 },
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
            </View>
            <View style={{ backgroundColor: '#fff', margin: 5, padding: 5 }}>
              <Text style={textStyles.label}>Ghi chú</Text>
              <Textarea
                size='md'
                isReadOnly={false}
                isInvalid={false}
                isDisabled={false}
                w='100%'
                marginTop={20}
              >
                <TextareaInput
                  value={bookingInfo.customerNote}
                  placeholder='Your text goes here...'
                  onChange={(event) => handleChangeNote(event)}
                />
              </Textarea>
            </View>

            <View
              style={{ marginTop: 10, padding: 15, backgroundColor: '#fff' }}
            >
              <View
                style={[
                  viewStyles.flexRow,
                  { justifyContent: 'space-between' },
                ]}
              >
                <Text style={[textStyles.normal]}>Tổng tiền dịch vụ:</Text>
                <Text style={[textStyles.normal]}>
                  {' '}
                  {formatCurrency(bookingInfo.bookingHomePrice) || 0}
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
            </View>
            <TouchableOpacity
              style={[
                buttonStyles.buttonConfirm,
                { width: '70%', alignSelf: 'center', height: 40 },
              ]}
              onPress={() => handleBooking()}
            >
              <Text
                style={{
                  color: '#fff',
                  fontWeight: 'bold',
                  alignSelf: 'center',
                  fontSize: 17,
                }}
              >
                Thanh toán VNPAY {bookingInfo.bookingHomePrice - userPoint}{' '}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
export default ProcessingBookingHome;
