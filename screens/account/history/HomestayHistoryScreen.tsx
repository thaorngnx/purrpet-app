import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronRightIcon,
  Tabs,
} from '@gluestack-ui/themed';
import textStyles from '../../styles/TextStyles';
import viewStyles from '../../styles/ViewStyles';
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useEffect, useState } from 'react';
import { getBookingHomes } from '../../../api/bookingHome';
import {
  BookingHome,
  BookingHomeResponse,
} from '../../../interface/BookingHome';
import * as CONST from '../../constants';
import { ScrollView } from 'react-native';
import { formatCurrency, formatDateTime } from '../../../utils/formatData';

const HomestayHistoryScreen = ({ navigation }: any) => {
  const [resBHomes, setResBHomes] = useState({} as BookingHomeResponse);
  const [tabHome, setTabHome] = useState(0);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const params = {
      // limit: 10,
      // page: page,
      // spa: sort,
    };
    //api get spa
    getBookingHomes(params).then((res) => {
      if (res.err === 0) {
        setResBHomes(res);
      }

      //
    });
  }, [tabHome]); //page

  const bHomes = resBHomes.data;
  let totalPage = resBHomes.totalPage;

  let bHomeByStatus = [];

  if (tabHome === 0) {
    bHomeByStatus = bHomes;
  } else {
    const status = Object.values(CONST.STATUS_BOOKING)[tabHome - 1];
    bHomeByStatus = bHomes?.filter((bHome) => bHome.status === status) || [];
  }

  // const handleChangePage = (event, value) => {
  //   setPage(value);
  // };

  return (
    <>
      <SafeAreaView style={viewStyles.container}>
        <View style={viewStyles.titlePageBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeftIcon />
          </TouchableOpacity>
          <Text style={textStyles.title}>Lịch sử đặt phòng</Text>
        </View>
        <View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={viewStyles.tabContainer}
            key={tabHome}
          >
            <TouchableOpacity
              key={0}
              style={[viewStyles.tab, tabHome === 0 && viewStyles.activeTab]}
              onPress={() => setTabHome(0)}
            >
              <Text style={viewStyles.tabText}>Tất cả</Text>
            </TouchableOpacity>
            {Object.values(CONST.STATUS_BOOKING).map((status, index) => (
              <TouchableOpacity
                key={index + 1}
                style={[
                  viewStyles.tab,
                  tabHome === index + 1 && viewStyles.activeTab,
                ]}
                onPress={() => setTabHome(index + 1)}
              >
                <Text style={viewStyles.tabText}>{status}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={viewStyles.scrollContainer}
        >
          {bHomeByStatus?.length > 0 &&
            bHomeByStatus.map((booking: BookingHome) => (
              <View style={viewStyles.orderCard} key={booking.purrPetCode}>
                <View style={viewStyles.flexRow} className='justify-between'>
                  <View style={viewStyles.flexRow}>
                    <Text style={textStyles.label} className='mr-1'>
                      Ngày đặt:
                    </Text>
                    <Text style={textStyles.normal}>
                      {formatDateTime(booking.createdAt)}
                    </Text>
                  </View>
                  <View style={viewStyles.flexRow}>
                    <Text style={textStyles.label} className='mr-1'>
                      Trạng thái:
                    </Text>
                    <Text style={textStyles.normal}>{booking.status}</Text>
                  </View>
                </View>
                <View style={viewStyles.flexRow} className='justify-between'>
                  <Text style={textStyles.hint}>
                    Mã đơn hàng: {booking.purrPetCode}
                  </Text>
                  <Text style={textStyles.hint}>
                    Tổng tiền: {formatCurrency(booking.bookingHomePrice)}
                  </Text>
                </View>
                <View style={viewStyles.colorCard}>
                  <View style={viewStyles.flexRow} className='items-center'>
                    <Text style={textStyles.label} className='m-1'>
                      Tên thú cưng:
                    </Text>
                    <Text style={textStyles.normal}>{booking.petName}</Text>
                  </View>
                  <View style={viewStyles.flexRow} className='items-center'>
                    <Text style={textStyles.label} className='m-1'>
                      Ngày vào:
                    </Text>
                    <Text style={textStyles.normal}>
                      {formatDateTime(booking.dateCheckIn)}
                    </Text>
                  </View>
                  <View style={viewStyles.flexRow} className='items-center'>
                    <Text style={textStyles.label} className='m-1'>
                      Ngày ra:
                    </Text>
                    <Text style={textStyles.normal}>
                      {formatDateTime(booking.dateCheckOut)}
                    </Text>
                  </View>
                  <View style={viewStyles.flexRow} className='items-center'>
                    <Text style={textStyles.label} className='m-1'>
                      Mã phòng:
                    </Text>
                    <Text style={textStyles.normal}>{booking.homeCode}</Text>
                  </View>
                </View>
                <View style={viewStyles.flexRow} className='justify-end'>
                  <TouchableOpacity
                    style={viewStyles.flexRow}
                    onPress={() =>
                      navigation.navigate('BookingHomeDetailScreen')
                    }
                  >
                    <Text className='mr-1 text-[#A16207]'>Xem chi tiết</Text>
                    <ChevronRightIcon color='#A16207' />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          {bHomeByStatus?.length === 0 && (
            <View style={viewStyles.orderCard}>
              <Text style={textStyles.normal}>
                Không có đơn đặt lịch nào ở trạng thái này
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default HomestayHistoryScreen;
