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
import { getOrders } from '../../../api/order';
import { Order, OrderResponse } from '../../../interface/Order';
import * as CONST from '../../constants';
import { ScrollView } from 'react-native';
import { formatCurrency, formatDateTime } from '../../../utils/formatData';

const OrderHistoryScreen = ({ navigation }: any) => {
  const [resOrders, setResOrders] = useState({} as OrderResponse);
  const [tabOrder, setTabOrder] = useState(0);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const params = {
      // limit: 10,
      // page: page,
      // key: categoryCode || searchKey,
      // order: sort,
    };
    //api get order
    getOrders(params).then((res) => {
      if (res.err === 0) {
        setResOrders(res);
      }
      //get all productCode in orderItems
      let productCodes: string[] = [];
      res.data.forEach((order: Order) => {
        order.orderItems.forEach((item) => {
          if (productCodes.includes(item.productCode)) return;
          productCodes.push(item.productCode);
        });
      });

      //
    });
  }, []);

  const orders = resOrders.data;
  let totalPage = resOrders.totalPage;

  let orderByStatus = [];

  if (tabOrder === 0) {
    orderByStatus = orders;
  } else {
    const status = Object.values(CONST.STATUS_ORDER)[tabOrder - 1];
    orderByStatus = orders?.filter((order) => order.status === status) || [];
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
          <Text style={textStyles.title}>Lịch sử mua hàng</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={viewStyles.tabContainer}
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
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={viewStyles.scrollContainer}
        >
          {orderByStatus?.length > 0 &&
            orderByStatus.map((order: Order) => (
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
                    />
                  ))}
                </View>
                <View style={viewStyles.flexRow} className='justify-end'>
                  <TouchableOpacity
                    style={viewStyles.flexRow}
                    onPress={() =>
                      navigation.navigate('OrderDetailScreen', { order })
                    }
                  >
                    <Text className='mr-1 text-[#A16207]'>Xem chi tiết</Text>
                    <ChevronRightIcon color='#A16207' />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          {orderByStatus?.length === 0 && (
            <View style={viewStyles.orderCard}>
              <Text style={textStyles.normal}>
                Không có đơn hàng nào ở trạng thái này
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default OrderHistoryScreen;
