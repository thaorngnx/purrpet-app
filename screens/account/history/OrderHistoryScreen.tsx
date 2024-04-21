import { ArrowLeftIcon, ChevronRightIcon } from '@gluestack-ui/themed';
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
import { Order, OrderRequestParams } from '../../../interface/Order';
import * as CONST from '../../constants';
import { formatCurrency, formatDateTime } from '../../../utils/formatData';
import { useOrderStore } from '../../../zustand/orderStore';
import { Pagination } from '../../../interface/Pagination';

interface ProductOrder {
  productCode: string;
  images: { path: string }[];
  name: string;
  quantity: number;
  price: number;
  totalPrice: number;
  star: number;
}

interface OrderDetail {
  order: Order;
  productOrders: ProductOrder[];
}

const OrderHistoryScreen = ({ navigation }: any) => {
  const listOrderState = useOrderStore((state) => state.listOrderState);

  const { getOrders } = useOrderStore();

  const [orders, setOrders] = useState<Order[]>([]);
  const [tabOrder, setTabOrder] = useState(0);
  const [pagination, setPagination] = useState({
    limit: 6,
    page: 1,
    total: 1,
  } as Pagination);
  const [loading, setLoading] = useState(false);
  const [stopLoadMore, setStopLoadMore] = useState(true);
  const flatListRef = useRef<FlatList<Order> | null>(null);

  useEffect(() => {
    const params = {
      limit: pagination.limit,
      page: 1,
    } as OrderRequestParams;
    if (tabOrder !== 0) {
      params['status'] = Object.values(CONST.STATUS_ORDER)[tabOrder - 1];
    }
    console.log('params:', params);

    //api get order
    getOrders(params);
    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
  }, [tabOrder]);

  useEffect(() => {
    if (listOrderState.pagination.page > 1) {
      setOrders(orders.concat(listOrderState.data));
      setPagination(listOrderState.pagination);
      // setStopLoadMore(true);
      setLoading(false);
    } else {
      setOrders(listOrderState.data);
      setPagination(listOrderState.pagination);
    }
  }, [listOrderState]);

  const handleLoadMore = async () => {
    console.log('handleLoadMore');

    if (!stopLoadMore) {
      setLoading(true);
      setStopLoadMore(true);
      const params = {
        limit: pagination.limit,
        page: pagination.page + 1,
      } as OrderRequestParams;

      console.log('params hlm:', params);

      if (tabOrder !== 0) {
        params['status'] = Object.values(CONST.STATUS_ORDER)[tabOrder - 1];
      }
      getOrders(params);
    }
  };

  return (
    <SafeAreaView style={viewStyles.container}>
      <View style={[viewStyles.titlePageBar]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeftIcon />
        </TouchableOpacity>
        <Text style={textStyles.title}>Lịch sử mua hàng</Text>
      </View>
      <View>
        <FlatList
          horizontal
          data={['Tất cả', ...Object.values(CONST.STATUS_ORDER)]}
          keyExtractor={(item) => item.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              key={index}
              style={[
                viewStyles.tab,
                tabOrder === index && viewStyles.activeTab,
              ]}
              onPress={() => setTabOrder(index)}
            >
              <Text style={viewStyles.tabText}>{item.toString()}</Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
          key={tabOrder}
        />
      </View>
      {orders?.length > 0 ? (
        <FlatList
          data={orders}
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
                  Tổng tiền: {formatCurrency(item.orderPrice)}
                </Text>
              </View>
              <View style={viewStyles.historyImagesWrapper}>
                {item.orderItems.map((item) => (
                  <Image
                    source={{ uri: item.image }}
                    style={viewStyles.historyImage}
                    key={item.productCode}
                  />
                ))}
              </View>
              <View style={viewStyles.flexRow} className='justify-end'>
                <TouchableOpacity
                  style={viewStyles.flexRow}
                  onPress={() =>
                    navigation.navigate('OrderDetailScreen', {
                      orderCode: item.purrPetCode,
                    })
                  }
                >
                  <Text className='mr-1 text-[#60A5FA]'>Xem chi tiết</Text>
                  <ChevronRightIcon color='#60A5FA' />
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
          ListFooterComponent={
            loading ? (
              <View>
                <Text className=' text-black'>Loading...</Text>
              </View>
            ) : null
          }
        />
      ) : (
        <View style={viewStyles.orderCard}>
          <Text style={textStyles.normal}>
            Không có đơn hàng nào ở trạng thái này
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default OrderHistoryScreen;
