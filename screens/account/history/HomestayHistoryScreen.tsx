import { ArrowLeftIcon, ChevronRightIcon } from '@gluestack-ui/themed';
import textStyles from '../../styles/TextStyles';
import viewStyles from '../../styles/ViewStyles';
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useEffect, useRef, useState } from 'react';
import {
  BookingHome,
  BookingHomeRequestParams,
} from '../../../interface/BookingHome';
import * as CONST from '../../constants';
import { formatCurrency, formatDateTime } from '../../../utils/formatData';
import { useBookingHomeStore } from '../../../zustand/bookingHomeStore';
import { Pagination } from '../../../interface/Pagination';

const HomestayHistoryScreen = ({ navigation }: any) => {
  const listBookingHomeState = useBookingHomeStore(
    (state) => state.listBookingHomeState,
  );

  const { getBookingHomes } = useBookingHomeStore();

  const [bHomes, setbHomes] = useState<BookingHome[]>([]);
  const [tabHome, setTabHome] = useState(0);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 1,
  } as Pagination);
  const [loading, setLoading] = useState(false);
  const [stopLoadMore, setStopLoadMore] = useState(true);
  const flatListRef = useRef<FlatList<BookingHome> | null>(null);

  useEffect(() => {
    const params = {
      limit: pagination.limit,
      page: pagination.page,
    } as BookingHomeRequestParams;

    if (tabHome !== 0) {
      params.status = Object.values(CONST.STATUS_BOOKING)[tabHome - 1];
    }
    //api get home
    getBookingHomes(params);
    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
  }, [tabHome]);

  useEffect(() => {
    if (listBookingHomeState.pagination.page > 1) {
      setbHomes(bHomes.concat(listBookingHomeState.data));
      setPagination(listBookingHomeState.pagination);
      setLoading(false);
    } else {
      setbHomes(listBookingHomeState.data);
      setPagination(listBookingHomeState.pagination);
    }
  }, [listBookingHomeState]);

  const handleLoadMore = async () => {
    console.log('handleLoadMore');

    if (!stopLoadMore) {
      setLoading(true);
      setStopLoadMore(true);
      const params = {
        limit: pagination.limit,
        page: pagination.page + 1,
      } as BookingHomeRequestParams;

      console.log('params hlm:', params);

      if (tabHome !== 0) {
        params['status'] = Object.values(CONST.STATUS_ORDER)[tabHome - 1];
      }
      getBookingHomes(params);
    }
  };

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
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={['Tất cả', ...Object.values(CONST.STATUS_BOOKING)]}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                key={index}
                style={[
                  viewStyles.tab,
                  tabHome === index && viewStyles.activeTab,
                ]}
                onPress={() => setTabHome(index)}
              >
                <Text style={viewStyles.tabText}>{item}</Text>
              </TouchableOpacity>
            )}
            onEndReachedThreshold={0.5}
            onEndReached={() => {
              console.log('onEndReached');
              if (pagination.page < pagination.total) {
                handleLoadMore();
              }
            }}
            onScrollBeginDrag={() => {
              setStopLoadMore(false);
            }}
          />
        </View>
        {bHomes?.length > 0 ? (
          <FlatList
            data={bHomes}
            // keyExtractor={(item) => item.purrPetCode}
            ref={flatListRef}
            renderItem={({ item }) => (
              <View style={viewStyles.orderCard} key={item.purrPetCode}>
                <View style={viewStyles.flexRow} className='justify-between'>
                  <View style={viewStyles.flexRow}>
                    <Text style={textStyles.label} className='mr-1'>
                      Ngày đặt:
                    </Text>
                    <Text style={textStyles.normal}>
                      {formatDateTime(item.createdAt)}
                    </Text>
                  </View>
                  <View style={viewStyles.flexRow}>
                    <Text style={textStyles.label} className='mr-1'>
                      Trạng thái:
                    </Text>
                    <Text style={textStyles.normal}>{item.status}</Text>
                  </View>
                </View>
                <View style={viewStyles.flexRow} className='justify-between'>
                  <Text style={textStyles.hint}>
                    Mã đơn hàng: {item.purrPetCode}
                  </Text>
                  <Text style={textStyles.hint}>
                    Tổng tiền: {formatCurrency(item.bookingHomePrice)}
                  </Text>
                </View>
                <View style={viewStyles.colorCard}>
                  <View style={viewStyles.flexRow} className='items-center'>
                    <Text style={textStyles.label} className='m-1'>
                      Tên thú cưng:
                    </Text>
                    <Text style={textStyles.normal}>{item.petName}</Text>
                  </View>
                  <View style={viewStyles.flexRow} className='items-center'>
                    <Text style={textStyles.label} className='m-1'>
                      Ngày vào:
                    </Text>
                    <Text style={textStyles.normal}>
                      {formatDateTime(item.dateCheckIn)}
                    </Text>
                  </View>
                  <View style={viewStyles.flexRow} className='items-center'>
                    <Text style={textStyles.label} className='m-1'>
                      Ngày ra:
                    </Text>
                    <Text style={textStyles.normal}>
                      {formatDateTime(item.dateCheckOut)}
                    </Text>
                  </View>
                  <View style={viewStyles.flexRow} className='items-center'>
                    <Text style={textStyles.label} className='m-1'>
                      Mã phòng:
                    </Text>
                    <Text style={textStyles.normal}>{item.homeCode}</Text>
                  </View>
                </View>
                <View style={viewStyles.flexRow} className='justify-end'>
                  <TouchableOpacity
                    style={viewStyles.flexRow}
                    onPress={() =>
                      navigation.navigate('BookingHomeDetailScreen', {
                        bookingHomeCode: item.purrPetCode,
                      })
                    }
                  >
                    <Text className='mr-1 text-[#A16207]'>Xem chi tiết</Text>
                    <ChevronRightIcon color='#A16207' />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        ) : (
          <View style={viewStyles.orderCard}>
            <Text style={textStyles.normal}>
              Không có đơn đặt lịch nào ở trạng thái này
            </Text>
          </View>
        )}
      </SafeAreaView>
    </>
  );
};

export default HomestayHistoryScreen;
