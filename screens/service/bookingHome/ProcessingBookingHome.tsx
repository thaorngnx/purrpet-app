import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
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

const ProcessingBookingHome = ({ navigation, route }: any) => {
  const { bookingInfo } = route.params;
  const [customerNote, setCustomerNote] = useState('');
  const customer = useCustomerStore((state) => state.customerState.data);
  const handleChangeNote = (event: any) => {
    const { text } = event.nativeEvent;
    setCustomerNote({ ...bookingInfo, customerNote: text });
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
    }).then((res) => {
      if (res) {
        if (res.err == 0) {
          console.log('Đặt lịch thành công');
          navigation.navigate('Dịch vụ');
        } else {
          console.log(res);
        }
      }
    });
  };
  return (
    <SafeAreaView>
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

      <CustomerInfoForm />
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
        <View style={[viewStyles.flexRow, { justifyContent: 'space-around' }]}>
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
          Thanh toán {bookingInfo.bookingSpaPrice}{' '}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
export default ProcessingBookingHome;
