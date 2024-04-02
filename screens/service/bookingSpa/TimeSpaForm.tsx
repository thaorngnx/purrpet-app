import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import textStyles from '../../styles/TextStyles';
import buttonStyles from '../../styles/ButtonStyles';
import { CalendarDays, ChevronDownIcon } from 'lucide-react-native';
import CalendarPicker from 'react-native-calendar-picker';
import dayjs from 'dayjs';
import { getAvailableTime } from '../../../api/bookingSpa';
import {
  Icon,
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from '@gluestack-ui/themed';

const TimeSpaForm = ({
  bookingInfo,
  updateBookingInfo,
}: {
  bookingInfo: any;
  updateBookingInfo: any;
}) => {
  const [validTime, setValidTime] = useState([]);
  const [openTimePicker, setOpenTimePicker] = useState(false);
  const [showDatePickerCheckin, setShowDatePickerCheckin] = useState(true);
  const handleBookingDateChange = (date: Date) => {
    setShowDatePickerCheckin(false);
    setOpenTimePicker(true);
    const newDate = dayjs(date).startOf('day');
    updateBookingInfo({
      ...bookingInfo,
      bookingDate: newDate,
      bookingTime: '',
    });
    getAvailableTime({
      bookingDate: newDate,
    }).then((res) => {
      console.log('res', res);
      if (res.err === 0) {
        setValidTime(res.data);
      } else {
        setValidTime([]);
      }
    });
  };

  const handleChangeBookingTime = (value: any) => {
    updateBookingInfo({
      ...bookingInfo,
      bookingTime: value,
    });
  };

  return (
    <View style={{ marginTop: 10, backgroundColor: '#fff', padding: 10 }}>
      <Text style={textStyles.labelCenter}>Thời gian đặt lịch</Text>
      <View>
        <Text style={textStyles.label} className='mb-3'>
          Chọn giờ đặt lịch:
        </Text>

        <TouchableOpacity
          style={styles.datePickerStyle}
          onPress={() => {
            setShowDatePickerCheckin(true);
          }}
        >
          <TextInput
            style={{
              width: '90%',
              color: '#000000',
              fontSize: 16,
            }}
            placeholder='Ngày vào'
            value={
              bookingInfo.bookingDate
                ? bookingInfo.bookingDate.format('DD/MM/YYYY')
                : ''
            }
            editable={false}
          />
          <CalendarDays size={32} color='#000000' />
        </TouchableOpacity>
        {showDatePickerCheckin && (
          <CalendarPicker
            onDateChange={handleBookingDateChange}
            minDate={new Date()}
          />
        )}
        {bookingInfo.bookingDate && validTime && validTime.length === 0 && (
          <Text style={textStyles.error}>
            Đã hết giờ trống trong ngày này. Vui lòng chọn ngày khác.
          </Text>
        )}
        {bookingInfo.bookingDate && validTime && validTime.length > 0 && (
          <Select
            onValueChange={handleChangeBookingTime}
            selectedValue={bookingInfo.bookingTime}
            style={{ marginTop: 15 }}
          >
            <SelectTrigger>
              <SelectInput
                placeholder='Tất cả'
                value={bookingInfo.bookingTime}
              />
              <Icon as={ChevronDownIcon} />
            </SelectTrigger>
            <SelectPortal>
              <SelectBackdrop />
              <SelectContent>
                <SelectDragIndicatorWrapper>
                  <SelectDragIndicator />
                </SelectDragIndicatorWrapper>
                <SelectItem label='Tất cả' value='' />
                {validTime.map((time, index) => (
                  <SelectItem key={index} label={time} value={time} />
                ))}
              </SelectContent>
            </SelectPortal>
          </Select>
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  datePickerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    paddingRight: 10,
  },
});
export default TimeSpaForm;
