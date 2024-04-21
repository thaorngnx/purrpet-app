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
  FlatList,
} from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { getBookingSpas } from '../../../api/bookingSpa';
import {
  BookingSpa,
  BookingSpaRequestParams,
  BookingSpaResponse,
} from '../../../interface/BookingSpa';
import * as CONST from '../../constants';
import { formatCurrency, formatDateTime } from '../../../utils/formatData';
import { Pagination } from '../../../interface/Pagination';
import { useBookingSpaStore } from '../../../zustand/bookingSpaStore';

const SpaHistoryScreen = ({ navigation }: any) => {
  const listBookingSpaState = useBookingSpaStore(
    (state) => state.listBookingSpaState,
  );

  const { getBookingSpas } = useBookingSpaStore();
  const [bSpas, setBSpas] = useState<BookingSpa[]>([]);
  const [tabSpa, setTabSpa] = useState(0);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    total: 1,
  } as Pagination);
  const [loading, setLoading] = useState(false);
  const [stopLoadMore, setStopLoadMore] = useState(true);
  const flatListRef = useRef<FlatList<BookingSpa> | null>(null);

  useEffect(() => {
    const params = {
      limit: pagination.limit,
      page: 1,
    } as BookingSpaRequestParams;
    if (tabSpa !== 0) {
      params['status'] = Object.values(CONST.STATUS_BOOKING)[tabSpa - 1];
    }
    //api get spa
    getBookingSpas(params);
    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
  }, [tabSpa]);

  useEffect(() => {
    if (listBookingSpaState.pagination.page > 1) {
      setBSpas(bSpas.concat(listBookingSpaState.data));
      setPagination(listBookingSpaState.pagination);
      setLoading(false);
    } else {
      setBSpas(listBookingSpaState.data);
      setPagination(listBookingSpaState.pagination);
    }
  }, [listBookingSpaState]);

  const handleLoadMore = async () => {
    console.log('handleLoadMore');

    if (!stopLoadMore) {
      setLoading(true);
      setStopLoadMore(true);
      const params = {
        limit: pagination.limit,
        page: pagination.page + 1,
      } as BookingSpaRequestParams;

      console.log('params hlm:', params);

      if (tabSpa !== 0) {
        params['status'] = Object.values(CONST.STATUS_ORDER)[tabSpa - 1];
      }
      getBookingSpas(params);
    }
  };

  return (
    <>
      <SafeAreaView style={viewStyles.container}>
        <View style={viewStyles.titlePageBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeftIcon />
          </TouchableOpacity>
          <Text style={textStyles.title}>Lịch sử đặt lịch spa</Text>
        </View>
        <View>
          <FlatList
            horizontal
            data={['Tất cả', ...Object.values(CONST.STATUS_BOOKING)]}
            keyExtractor={(item) => item}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                key={index}
                style={[
                  viewStyles.tab,
                  tabSpa === index && viewStyles.activeTab,
                ]}
                onPress={() => setTabSpa(index)}
              >
                <Text style={viewStyles.tabText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
        {bSpas?.length > 0 ? (
          <FlatList
            data={bSpas}
            // keyExtractor={(item) => item.purrPetCode}
            ref={flatListRef}
            renderItem={({ item }) => (
              <View style={viewStyles.orderCard}>
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
                    Tổng tiền: {formatCurrency(item.bookingSpaPrice)}
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
                      Ngày hẹn:
                    </Text>
                    <Text style={textStyles.normal}>
                      {formatDateTime(item.bookingDate)}
                      {' - '}
                      {item.bookingTime}
                    </Text>
                  </View>
                  <View style={viewStyles.flexRow} className='items-center'>
                    <Text style={textStyles.label} className='m-1'>
                      Mã dịch vụ:
                    </Text>
                    <Text style={textStyles.normal}>{item.spaCode}</Text>
                  </View>
                </View>
                <View style={viewStyles.flexRow} className='justify-end'>
                  <TouchableOpacity
                    style={viewStyles.flexRow}
                    onPress={() =>
                      navigation.navigate('BookingSpaDetailScreen', {
                        bookingSpaCode: item.purrPetCode,
                      })
                    }
                  >
                    <Text className='mr-1 text-[#A16207]'>Xem chi tiết</Text>
                    <ChevronRightIcon color='#A16207' />
                  </TouchableOpacity>
                </View>
              </View>
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

export default SpaHistoryScreen;
