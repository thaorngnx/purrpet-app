import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import CustomerInfoForm from '../CustomerInfoForm';
import textStyles from '../../styles/TextStyles';
import { ChevronLeftIcon } from 'lucide-react-native';
import { Icon, Textarea, TextareaInput } from '@gluestack-ui/themed';
import viewStyles from '../../styles/ViewStyles';
import { useState } from 'react';
import buttonStyles from '../../styles/ButtonStyles';
import { createBookingSpa } from '../../../api/bookingSpa';
import { useCustomerStore } from '../../../zustand/customerStore';
import { formatCurrency } from '../../../utils/formatData';
import textInputStyles from '../../styles/TextInputStyles';
import openInChrome from '../../../utils/openInChrome';
import { createPaymentUrl } from '../../../api/pay';

const ProcessingBookingSpa = ({ navigation, route }: any) => {
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
  console.log(customerNote);
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
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: 'pink',
                height: 50,
                flex: 1,
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
                Thanh toán VNPAY {bookingInfo.bookingSpaPrice - userPoint}{' '}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
export default ProcessingBookingSpa;
