import { ArrowLeftIcon, ChevronRightIcon } from '@gluestack-ui/themed';
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
import { getOrders } from '../../../api/order';
import {
  Order,
  OrderRequestParams,
  OrderResponse,
} from '../../../interface/Order';
import * as CONST from '../../constants';
import { ScrollView } from 'react-native';
import { formatCurrency, formatDateTime } from '../../../utils/formatData';
import { useOrderStore } from '../../../zustand/orderStore';
import { Pagination } from '../../../interface/Pagination';

const OrderHistoryScreen = ({ navigation }: any) => {
  const listOrderState = useOrderStore((state) => state.listOrderState);

  const { getOrders } = useOrderStore();

  const [orders, setOrders] = useState<Order[]>([]);
  const [tabOrder, setTabOrder] = useState(0);
  const [pagination, setPagination] = useState({
    limit: 10,
    page: 1,
    total: 1,
  } as Pagination);

  useEffect(() => {
    const params = {
      // limit: 10,
      // page: page,
      // key: categoryCode || searchKey,
      // order: sort,
    } as OrderRequestParams;
    if (tabOrder !== 0) {
      params['status'] = Object.values(CONST.STATUS_ORDER)[tabOrder - 1];
    }
    console.log('params:', params);
    //api get order
    getOrders(params);
  }, [tabOrder]);

  useEffect(() => {
    if (listOrderState.data) {
      setOrders(listOrderState.data);
      setPagination(listOrderState.pagination);
    }
  }, [listOrderState]);

  return (
    <SafeAreaView style={viewStyles.container}>
      <View style={[viewStyles.titlePageBar]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeftIcon />
        </TouchableOpacity>
        <Text style={textStyles.title}>Lịch sử mua hàng</Text>
      </View>

      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[viewStyles.tabContainer]}
          key={tabOrder}
        >
          <TouchableOpacity
            key={0}
            style={[viewStyles.tab, tabOrder === 0 && viewStyles.activeTab]}
            onPress={() => setTabOrder(0)}
          >
            <Text style={viewStyles.tabText}>Tất cả</Text>
          </TouchableOpacity>
          {Object.values(CONST.STATUS_ORDER).map((status, index) => (
            <TouchableOpacity
              key={index + 1}
              style={[
                viewStyles.tab,
                tabOrder === index + 1 && viewStyles.activeTab,
              ]}
              onPress={() => setTabOrder(index + 1)}
            >
              <Text style={viewStyles.tabText}>{status}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[viewStyles.scrollContainer]}
      >
        {!listOrderState.loading &&
          orders?.length > 0 &&
          orders.map((order: Order) => (
            <View style={viewStyles.orderCard} key={order.purrPetCode}>
              <View style={viewStyles.flexRow} className='justify-between'>
                <View style={viewStyles.flexRow}>
                  <Text style={textStyles.label} className='mr-1'>
                    Ngày đặt:
                  </Text>
                  <Text style={textStyles.normal}>
                    {formatDateTime(order.createdAt)}
                  </Text>
                </View>
                <View style={viewStyles.flexRow}>
                  <Text style={textStyles.label} className='mr-1'>
                    Trạng thái:
                  </Text>
                  <Text style={textStyles.normal}>{order.status}</Text>
                </View>
              </View>
              <View style={viewStyles.flexRow} className='justify-between'>
                <Text style={textStyles.hint}>
                  Mã đơn hàng: {order.purrPetCode}
                </Text>
                <Text style={textStyles.hint}>
                  Tổng tiền: {formatCurrency(order.orderPrice)}
                </Text>
              </View>
              <View style={viewStyles.historyImagesWrapper}>
                {order.orderItems.map((item) => (
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
                      order: order,
                    })
                  }
                >
                  <Text className='mr-1 text-[#A16207]'>Xem chi tiết</Text>
                  <ChevronRightIcon color='#A16207' />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        {orders?.length === 0 && (
          <View style={viewStyles.orderCard}>
            <Text style={textStyles.normal}>
              Không có đơn hàng nào ở trạng thái này
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderHistoryScreen;
