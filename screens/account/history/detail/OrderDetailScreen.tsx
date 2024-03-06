import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import viewStyles from '../../../styles/ViewStyles';
import { TouchableOpacity } from 'react-native';
import { ArrowLeftIcon } from '@gluestack-ui/themed';
import textStyles from '../../../styles/TextStyles';
import { formatDateTime } from '../../../../utils/formatData';
import { Order } from '../../../../interface/Order';
import { useEffect, useState } from 'react';
import { getOrderByCode } from '../../../../api/order';
import { getProducts } from '../../../../api/product';

interface ProductOrder {
  productCode: string;
  images: string[];
  name: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

interface OrderDetail {
  order: Order;
  productOrders: ProductOrder[];
}

const OrderDetailScreen = ({ navigation, route }: any) => {
  const { order } = route.params as { order: Order };

  const [orderDetail, setOrderDetail] = useState<OrderDetail>(
    {} as OrderDetail,
  );

  useEffect(() => {
    getOrderByCode(order.purrPetCode).then((res) => {
      console.log(res);
      if (res.err === 0) {
        const order = res.data;
        const orderItems = res.data.orderItems;
        const productCodes: string[] = [];
        res.data.orderItems.forEach((item: any) => {
          productCodes.push(item.productCode);
        });
        getProducts({ productCodes: productCodes.toString() }).then((res) => {
          console.log(res);
          if (res.err === 0) {
            let productOrder: ProductOrder[] = [];
            res.data.forEach((item: any) => {
              orderItems.forEach((orderItem: any) => {
                if (item.purrPetCode === orderItem.productCode) {
                  let product = {
                    productCode: orderItem.productCode,
                    images: item.images,
                    name: item.productName,
                    quantity: orderItem.quantity,
                    price: orderItem.productPrice,
                    totalPrice: orderItem.totalPrice,
                  };
                  console.log(product);
                  productOrder.push(product);
                }
              });
            });
            setOrderDetail({
              order: order,
              productOrders: productOrder,
            });
          }
        });
      }
    });
  }, []);

  return (
    <SafeAreaView style={viewStyles.container}>
      <View style={viewStyles.titlePageBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeftIcon />
        </TouchableOpacity>
        <Text style={textStyles.title}>Chi tiết đơn hàng</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={viewStyles.scrollContainer}
      >
        <View style={viewStyles.orderCard}>
          <View style={viewStyles.flexRow} className='justify-between'>
            <View style={viewStyles.flexRow}>
              <Text style={textStyles.label} className='mr-1'>
                Ngày đặt:
              </Text>
              <Text style={textStyles.normal}>
                {formatDateTime(order?.createdAt)}
              </Text>
            </View>
            <View style={viewStyles.flexRow}>
              <Text style={textStyles.label} className='mr-1'>
                Trạng thái:
              </Text>
              <Text style={textStyles.normal}>{order?.status}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderDetailScreen;
