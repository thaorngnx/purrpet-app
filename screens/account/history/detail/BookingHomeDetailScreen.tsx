import viewStyles from '../../../styles/ViewStyles';
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
import { useEffect, useState } from 'react';
import textStyles from '../../../styles/TextStyles';
import { formatCurrency, formatDateTime } from '../../../../utils/formatData';
import { BookingHomeDetail } from '../../../../interface/BookingHome';
import {
  getBookingHomeByCode,
  updateStatusBookingHome,
} from '../../../../api/bookingHome';
import { getHomestayByCode } from '../../../../api/homestay';
import buttonStyles from '../../../styles/ButtonStyles';
import * as CONST from '../../../constants';
import { createPaymentUrl } from '../../../../api/pay';
import openInChrome from '../../../../utils/openInChrome';
import dayjs from 'dayjs';
import { useCustomerStore } from '../../../../zustand/customerStore';

const BookingHomeDetailScreen = ({ navigation, route }: any) => {
  const customer = useCustomerStore((state) => state.customerState.data);
  const bookingHomeCode = route.params.bookingHomeCode as string;
  const [loading, setLoading] = useState(true);
  const [bookingHomeDetail, setBookingHomeDetail] =
    useState<BookingHomeDetail>();
  // const [cancel, setCancel] = useState(false);

  useEffect(() => {
    //api get booking spa by code
    getBookingHomeByCode(bookingHomeCode).then((res: any) => {
      if (res.err === 0) {
        const bookingHomeDetail = res.data;
        setBookingHomeDetail(res.data);
        getHomestayByCode(bookingHomeDetail.homeCode).then((res) => {
          if (res.err === 0) {
            const homeStay = res.data;
            setBookingHomeDetail({
              ...bookingHomeDetail,
              homestay: homeStay,
            });
          }
        });
      } else {
        console.log('error', res.message);
      }
      setLoading(false);
    });
  }, []); //bookingSpa.purrPetCode
  // useEffect(() => {
  //   const checkedTimeCancel = () => {
  //     const timeNow = dayjs();
  //     const timeCheckin = dayjs(bookingHomeDetail?.dateCheckIn);
  //     const timeDiff = timeCheckin.diff(timeNow);
  //     const twentyFourHours = 24 * 60 * 60 * 1000; // 24 giờ expressed in milliseconds

  //     if (
  //       timeDiff > twentyFourHours &&
  //       bookingHomeDetail?.status === CONST.STATUS_BOOKING.PAID
  //     ) {
  //       setCancel(true);
  //     }
  //   };
  //   checkedTimeCancel();
  // }, [bookingHomeDetail]);
  const handleCancelBooking = () => {
    updateStatusBookingHome(bookingHomeCode, CONST.STATUS_BOOKING.CANCEL).then(
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
      orderCode: bookingHomeCode,
      returnUrl: 'vnpay-returnForMoblie',
    }).then((res) => {
      if (res.err === 0) {
        console.log('Đặt hàng thành công!');
        openInChrome(res.data.paymentUrl, navigation, customer);
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
        <Text style={textStyles.title}>Chi tiết đơn hàng</Text>
      </View>
      {bookingHomeDetail?.status === CONST.STATUS_BOOKING.WAITING_FOR_PAY && (
        <>
          <Text className='text-base italic text-red-800 p-1'>
            Vui lòng thanh toán để hoàn tất đơn. Đơn hàng sẽ tự động hủy sau 10
            phút đặt hàng nếu không thanh toán.
          </Text>
        </>
      )}
      {bookingHomeDetail?.status === CONST.STATUS_BOOKING.PAID && (
        <>
          <Text className='text-base italic text-green-800 p-1'>
            Sau 24h so với thời gian check-in: Chỉ được hoàn 90% số tiền đã
            thanh toán.
          </Text>
        </>
      )}
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
                    {formatDateTime(bookingHomeDetail?.createdAt)}
                  </Text>
                </View>
                <View style={viewStyles.flexRow} className='mb-1'>
                  <Text style={textStyles.label}>Trạng thái:</Text>
                  <Text style={textStyles.normal}>
                    {bookingHomeDetail?.status}
                  </Text>
                </View>
              </View>
              <View style={viewStyles.flexRow}>
                <Text style={textStyles.label}>Ghi chú:</Text>
                <Text style={textStyles.normal}>
                  {bookingHomeDetail?.customerNote}
                </Text>
              </View>
              <View style={viewStyles.flexRow}>
                <Text style={textStyles.label}>Phuơng thức thanh toán:</Text>
                <Text style={textStyles.normal}>
                  {bookingHomeDetail?.payMethod}
                </Text>
              </View>
              <View style={viewStyles.line} />
              <View style={viewStyles.flexRow} className='mb-1'>
                <Text style={textStyles.label}>Họ Tên:</Text>
                <Text style={textStyles.normal}>
                  {bookingHomeDetail?.customerName}
                </Text>
              </View>
              <View style={viewStyles.flexRow} className='mb-1'>
                <Text style={textStyles.label}>Số điện thoại:</Text>
                <Text style={textStyles.normal}>
                  {bookingHomeDetail?.customerPhone}
                </Text>
              </View>
              <View style={viewStyles.flexRow} className='mb-1'>
                <Text style={textStyles.label}>Email:</Text>
                <Text style={textStyles.normal}>
                  {bookingHomeDetail?.customerEmail}
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
                  {bookingHomeDetail?.petName}
                </Text>
              </View>
              <View style={viewStyles.flexRow} className='mb-1'>
                <Text style={textStyles.label}>Ngày vào:</Text>
                <Text style={textStyles.normal}>
                  {formatDateTime(bookingHomeDetail?.dateCheckIn)}
                </Text>
              </View>
              <View style={viewStyles.flexRow} className='mb-1'>
                <Text style={textStyles.label}>Ngày ra:</Text>
                <Text style={textStyles.normal}>
                  {formatDateTime(bookingHomeDetail?.dateCheckOut)}
                </Text>
              </View>
            </View>
          </View>
          <View></View>
          <View style={viewStyles.boxUnderline}>
            <Text style={[textStyles.title]}>Thông tin phòng</Text>
            <View style={viewStyles.flexRow} className='justify-between'>
              <Text style={textStyles.label}>Mã phòng:</Text>
              <Text style={textStyles.normal}>
                {bookingHomeDetail?.homestay?.purrPetCode}
              </Text>
            </View>
            <View style={viewStyles.flexRow} className='justify-between'>
              <Text style={textStyles.label}>Loại phòng:</Text>
              <Text style={textStyles.normal}>
                {bookingHomeDetail?.homestay?.homeType}
              </Text>
            </View>
            <View style={viewStyles.flexRow} className='justify-between'>
              <Text style={textStyles.label}>Loại thú cưng:</Text>
              <Text style={textStyles.normal}>
                {bookingHomeDetail?.homestay?.categoryName}
              </Text>
            </View>
            <View style={viewStyles.flexRow} className='justify-between'>
              <Text style={textStyles.label}>Kích thước:</Text>
              <Text style={textStyles.normal}>
                {bookingHomeDetail?.homestay?.masterDataName}
              </Text>
            </View>
            <View style={viewStyles.flexRow} className='justify-between'>
              <Text style={textStyles.label}>Số ngày:</Text>
              <Text style={textStyles.normal}>
                {bookingHomeDetail?.numberOfDay}
              </Text>
            </View>
            <View style={viewStyles.flexRow} className='justify-between'>
              <Text style={textStyles.label}>Đơn giá:</Text>
              <Text style={textStyles.normal}>
                {formatCurrency(bookingHomeDetail?.homestay?.price as number)}
              </Text>
            </View>
          </View>
          <View style={viewStyles.boxUnderline}>
            <View style={viewStyles.flexRow} className='justify-between'>
              <Text style={textStyles.label}>Tổng tiền:</Text>
              <Text style={textStyles.normal}>
                {formatCurrency(bookingHomeDetail?.bookingHomePrice as number)}
              </Text>
            </View>
            <View style={viewStyles.flexRow} className='justify-between'>
              <Text style={textStyles.label}>Điểm tích lũy sử dụng:</Text>
              <Text style={textStyles.normal}>
                -{formatCurrency(bookingHomeDetail?.pointUsed as number)}
              </Text>
            </View>
            <View style={viewStyles.flexRow} className='justify-between'>
              <Text style={textStyles.label}>Sử dụng ví xu:</Text>
              <Text style={textStyles.normal}>
                -{formatCurrency(bookingHomeDetail?.useCoin as number)}
              </Text>
            </View>
            <View style={viewStyles.flexRow} className='justify-between'>
              <Text style={textStyles.label}>Tổng thanh toán:</Text>
              <Text style={textStyles.normal}>
                {formatCurrency(bookingHomeDetail?.totalPayment as number)}
              </Text>
            </View>
          </View>
          {bookingHomeDetail?.status ===
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
          {bookingHomeDetail?.status === CONST.STATUS_BOOKING.PAID && (
            <View style={viewStyles.flexRow} className='justify-center'>
              <TouchableOpacity
                style={buttonStyles.buttonOutline}
                onPress={() => handleCancelBooking()}
              >
                <Text style={styles.buttonOutlineText}>Huỷ đơn</Text>
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

export default BookingHomeDetailScreen;
