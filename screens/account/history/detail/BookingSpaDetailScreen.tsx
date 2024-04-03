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
} from 'react-native';
import textStyles from '../../../styles/TextStyles';
import * as CONST from '../../../constants';
import { useEffect, useState } from 'react';
import { formatCurrency, formatDateTime } from '../../../../utils/formatData';
import { getBookingSpaByCode } from '../../../../api/bookingSpa';
import { getSpaByCode } from '../../../../api/spa';

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

  return (
    <SafeAreaView style={viewStyles.container}>
      <View style={viewStyles.titlePageBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeftIcon />
        </TouchableOpacity>
        <Text style={textStyles.title}>Chi tiết đặt lịch spa</Text>
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
                  {formatDateTime(bookingSpaDetail?.bookingTime)}
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
              Lịch spa
            </Text>
            <View style={viewStyles.flexRow} className='justify-between'>
              <Text style={textStyles.label}>Tên spa:</Text>
              <Text style={textStyles.normal}>
                {/* {bookingSpaDetail?.spa?.name} */}
              </Text>
            </View>
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

export default BookingSpaDetailScreen;
