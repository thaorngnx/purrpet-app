import viewStyles from '../../../styles/ViewStyles';
import { ArrowLeftIcon, Spinner } from '@gluestack-ui/themed';
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { useEffect, useState } from 'react';
import textStyles from '../../../styles/TextStyles';
import { formatDateTime } from '../../../../utils/formatData';
import {
  BookingHome,
  BookingHomeDetail,
} from '../../../../interface/BookingHome';
import { getBookingHomeByCode } from '../../../../api/bookingHome';
import { getHomestayByCode } from '../../../../api/homestay';

const BookingHomeDetailScreen = ({ navigation, route }: any) => {
  const bookingHomeCode = route.params.bookingHomeCode as string;
  const [loading, setLoading] = useState(true);
  const [bookingHomeDetail, setBookingHomeDetail] =
    useState<BookingHomeDetail>();

  useEffect(() => {
    //api get booking spa by code
    getBookingHomeByCode(bookingHomeCode).then((res) => {
      if (res.err === 0) {
        const bookingHomeDetail = res.data;
        setBookingHomeDetail(res.data);
        getHomestayByCode(bookingHomeDetail.spaCode).then((res) => {
          if (res.err === 0) {
            const homeStay = res.data;
            setBookingHomeDetail({
              ...bookingHomeDetail,
              spa: homeStay,
            });
          }
        });
      } else {
        console.log('error', res.message);
      }
      setLoading(false);
    });
  }, []); //bookingSpa.purrPetCode

  return (
    <SafeAreaView style={viewStyles.container}>
      <View style={viewStyles.titlePageBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeftIcon />
        </TouchableOpacity>
        <Text style={textStyles.title}>Chi tiết đơn hàng</Text>
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
          <View>
            <Text
              style={[
                {
                  marginHorizontal: 10,
                  marginBottom: 5,
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#265F77',
                },
              ]}
            >
              Danh sách sản phẩm
            </Text>
            {/* {bookingSpaDetail.productOrders.map((productOrder, index) => (
              <View style={viewStyles.boxUnderline} key={index}>
                <View style={viewStyles.flexRow}>
                  <Image
                    source={{ uri: productOrder.images[0]?.path }}
                    style={viewStyles.historyImage}
                  />
                  <View style={viewStyles.flexColumn} className='w-[76%]'>
                    <Text
                      numberOfLines={1}
                      style={textStyles.normal}
                      className='truncate'
                    >
                      {productOrder.name}
                    </Text>
                    <View
                      style={viewStyles.flexRow}
                      className='justify-between'
                    >
                      <Text style={textStyles.normal}>
                        {formatCurrency(productOrder.price)}
                      </Text>
                      <Text style={textStyles.normal}>
                        x{productOrder.quantity}
                      </Text>
                    </View>
                    <View style={viewStyles.flexRow} className='justify-end'>
                      <Text style={textStyles.normal}>
                        {formatCurrency(productOrder.totalPrice)}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))} */}
          </View>
          <View style={viewStyles.boxUnderline}>
            <View style={viewStyles.flexRow} className='justify-between'>
              <Text style={textStyles.label}>Tổng tiền:</Text>
              <Text style={textStyles.normal}>
                {/* {formatCurrency(bookingSpaDetail.)} */}
              </Text>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default BookingHomeDetailScreen;
