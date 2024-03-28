import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import CustomerInfoForm from '../CustomerInfoForm';
import textStyles from '../../styles/TextStyles';
import { ChevronLeftIcon } from 'lucide-react-native';
import { Icon, Textarea, TextareaInput } from '@gluestack-ui/themed';
import viewStyles from '../../styles/ViewStyles';
import { useState } from 'react';
import buttonStyles from '../../styles/ButtonStyles';
import { createBookingSpa } from '../../../api/bookingSpa';
import { useCustomerStore } from '../../../zustand/customerStore';

const ProcessingBookingSpa = ({ navigation, route }: any) => {
  const { bookingInfo } = route.params;
  const [customerNote, setCustomerNote] = useState('');
  const customer = useCustomerStore((state) => state.customerState.data);
  const handleChangeNote = (event: any) => {
    const { text } = event.nativeEvent;
    setCustomerNote({ ...bookingInfo, customerNote: text });
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
            { justifyContent: 'space-around', marginTop: 10 },
          ]}
        >
          <Text style={textStyles.label}>Ngày đặt lịch:</Text>
          <Text style={textStyles.normal}>
            {bookingInfo.bookingDate.format('YYYY-MM-DD')}
          </Text>
          <Text style={textStyles.label}>Giờ đặt lịch:</Text>
          <Text style={textStyles.normal}>{bookingInfo.bookingTime}</Text>
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
export default ProcessingBookingSpa;
