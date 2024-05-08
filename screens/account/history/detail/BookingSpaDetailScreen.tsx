import viewStyles from '../../../styles/ViewStyles';
import { BookingSpa, BookingSpaDetail } from '../../../../interface/BookingSpa';
import { ArrowLeftIcon, Spinner } from '@gluestack-ui/themed';
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import textStyles from '../../../styles/TextStyles';
import * as CONST from '../../../constants';
import { useEffect, useState } from 'react';
import { formatCurrency, formatDateTime } from '../../../../utils/formatData';
import {
  getBookingSpaByCode,
  updateStatusBookingSpa,
} from '../../../../api/bookingSpa';
import { getSpaByCode } from '../../../../api/spa';
import buttonStyles from '../../../styles/ButtonStyles';
import { createPaymentUrl } from '../../../../api/pay';
import openInChrome from '../../../../utils/openInChrome';

const BookingSpaDetailScreen = ({ navigation, route }: any) => {
  const bookingSpaId = route.params.bookingSpaCode as string;
  const [loading, setLoading] = useState(true);
  const [bookingSpaDetail, setBookingSpaDetail] = useState<BookingSpaDetail>();

  useEffect(() => {
    //api get booking spa by code
    getBookingSpaByCode(bookingSpaId).then((res) => {
      if (res.err === 0) {
        const bookingSpaDetail = res.data;
        setBookingSpaDetail(res.data);
        getSpaByCode(bookingSpaDetail.spaCode).then((res) => {
          if (res.err === 0) {
            const spa = res.data;
            setBookingSpaDetail({
              ...bookingSpaDetail,
              spa: spa,
            });
          }
        });
      } else {
        console.log('error', res.message);
      }
      setLoading(false);
    });
  }, []); //bookingSpa.purrPetCode

  const handleCancelBooking = () => {
    updateStatusBookingSpa(bookingSpaId, CONST.STATUS_BOOKING.CANCEL).then(
      (res) => {
        if (res.err === 0) {
          console.log('Huỷ đơn thành công');
          navigation.navigate('HistoryScreen');
        } else {
          console.log('error', res.message);
        }
      },
    );
  };
  const handlePay = () => {
    createPaymentUrl({
      orderCode: bookingSpaId,
    }).then((res) => {
      if (res.err === 0) {
        console.log('Đặt hàng thành công!');
        openInChrome(res.data.paymentUrl, navigation);
      } else {
        console.log('error', res.message);
      }
    });
  };

  return (
    <SafeAreaView style={viewStyles.container}>
      <View style={viewStyles.titlePageBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeftIcon />
        </TouchableOpacity>
        <Text style={textStyles.title}>
          Chi tiết đặt lịch spa {bookingSpaId}
        </Text>
      </View>
      {loading ? (
        <View style={viewStyles.centerContainer}>
          <Spinner size='large' />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={viewStyles.scrollContainer}
        >
          <View>
            <View
              style={{
                padding: 10,
                backgroundColor: '#f0f0f0',
                marginBottom: 10,
                width: 'auto',
              }}
            >
              <View style={viewStyles.flexRow} className='justify-between'>
                <View style={viewStyles.flexRow} className='mb-1'>
                  <Text style={textStyles.label}>Ngày đặt:</Text>
                  <Text style={textStyles.normal}>
                    {formatDateTime(bookingSpaDetail?.createdAt)}
                  </Text>
                </View>
                <View style={viewStyles.flexRow} className='mb-1'>
                  <Text style={textStyles.label}>Trạng thái:</Text>
                  <Text style={textStyles.normal}>
                    {bookingSpaDetail?.status}
                  </Text>
                </View>
              </View>
              <View style={viewStyles.flexRow}>
                <Text style={textStyles.label}>Ghi chú:</Text>
                <Text style={textStyles.normal}>
                  {bookingSpaDetail?.customerNote}
                </Text>
              </View>
              <View style={viewStyles.line} />
              <View style={viewStyles.flexRow} className='mb-1'>
                <Text style={textStyles.label}>Họ Tên:</Text>
                <Text style={textStyles.normal}>
                  {bookingSpaDetail?.customerName}
                </Text>
              </View>
              <View style={viewStyles.flexRow} className='mb-1'>
                <Text style={textStyles.label}>Số điện thoại:</Text>
                <Text style={textStyles.normal}>
                  {bookingSpaDetail?.customerPhone}
                </Text>
              </View>
              <View style={viewStyles.flexRow} className='mb-1'>
                <Text style={textStyles.label}>Email:</Text>
                <Text style={textStyles.normal}>
                  {bookingSpaDetail?.customerEmail}
                </Text>
              </View>

              <View style={viewStyles.line} />
              {/* <View style={viewStyles.flexRow} className='mb-1'>
                <Text style={textStyles.label}>Thông tin thanh toán:</Text>
                <Text style={textStyles.normal}>
                  {formatCurrency(bookingSpaDetail.)}
                </Text>
              </View>
              <View style={viewStyles.flexRow} className='mb-1'>
                <Text style={textStyles.label}>Phương thức thanh toán:</Text>
                <Text style={textStyles.normal}>
                  {bookingSpaDetail.order?.payMethod}
                </Text>
              </View>
              <View style={viewStyles.flexRow} className='mb-1'>
                <Text style={textStyles.label}>Trạng thái thanh toán:</Text>
                <Text style={textStyles.normal}>
                  {bookingSpaDetail.order?.paymentStatus}
                </Text>
              </View> */}
              <View style={viewStyles.flexRow} className='mb-1'>
                <Text style={textStyles.label}>Tên thú cưng:</Text>
                <Text style={textStyles.normal}>
                  {bookingSpaDetail?.petName}
                </Text>
              </View>
              <View style={viewStyles.flexRow} className='mb-1'>
                <Text style={textStyles.label}>Ngày hẹn:</Text>
                <Text style={textStyles.normal}>
                  {formatDateTime(bookingSpaDetail?.bookingDate)}
                </Text>
              </View>
              <View style={viewStyles.flexRow} className='mb-1'>
                <Text style={textStyles.label}>Giờ hẹn:</Text>
                <Text style={textStyles.normal}>
                  {bookingSpaDetail?.bookingTime}
                </Text>
              </View>
            </View>
          </View>
          <View style={viewStyles.boxUnderline}>
            <Text style={[textStyles.title]}>Thông tin spa</Text>
            <View style={viewStyles.flexRow} className='justify-between'>
              <Text style={textStyles.label}>Mã spa:</Text>
              <Text style={textStyles.normal}>
                {bookingSpaDetail?.spa?.purrPetCode}
              </Text>
            </View>
            <View style={viewStyles.flexRow} className='justify-between'>
              <Text style={textStyles.label}>Tên spa:</Text>
              <Text style={textStyles.normal}>
                {bookingSpaDetail?.spa?.spaName}
              </Text>
            </View>
            <View style={viewStyles.flexRow} className='justify-between'>
              <Text style={textStyles.label}>Loại thú cưng:</Text>
              <Text style={textStyles.normal}>
                {bookingSpaDetail?.spa?.spaType}
              </Text>
            </View>
            <View style={viewStyles.flexRow} className='justify-between'>
              <Text style={textStyles.label}>Mô tả:</Text>
              <Text style={textStyles.normal}>
                {bookingSpaDetail?.spa?.description}
              </Text>
            </View>
          </View>
          <View style={viewStyles.boxUnderline}>
            <View style={viewStyles.flexRow} className='justify-between'>
              <Text style={textStyles.label}>Tổng tiền:</Text>
              <Text style={textStyles.normal}>
                {formatCurrency(bookingSpaDetail?.bookingSpaPrice as number)}
              </Text>
            </View>
            <View style={viewStyles.flexRow} className='justify-between'>
              <Text style={textStyles.label}>Điểm tích lũy sử dụng:</Text>
              <Text style={textStyles.normal}>
                -{formatCurrency(bookingSpaDetail?.pointUsed as number)}
              </Text>
            </View>
            <View style={viewStyles.flexRow} className='justify-between'>
              <Text style={textStyles.label}>Tổng thanh toán:</Text>
              <Text style={textStyles.normal}>
                {formatCurrency(bookingSpaDetail?.totalPayment as number)}
              </Text>
            </View>
          </View>
          {bookingSpaDetail?.status ===
            CONST.STATUS_BOOKING.WAITING_FOR_PAY && (
            <View style={viewStyles.flexRow} className='justify-center'>
              <TouchableOpacity
                style={buttonStyles.buttonOutline}
                onPress={() => handleCancelBooking()}
              >
                <Text style={styles.buttonOutlineText}>Huỷ đơn</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={buttonStyles.buttonOutline}
                onPress={() => handlePay()}
              >
                <Text style={styles.buttonOutlineText}>Thanh toán</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  buttonOutlineText: {
    ...textStyles.bold,
    color: '#60A5FA',
    marginHorizontal: 10,
  },
});

export default BookingSpaDetailScreen;
