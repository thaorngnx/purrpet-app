import { Image, SafeAreaView, ScrollView, Text, View } from 'react-native';
import viewStyles from '../../../styles/ViewStyles';
import { TouchableOpacity } from 'react-native';
import { ArrowLeftIcon } from '@gluestack-ui/themed';
import textStyles from '../../../styles/TextStyles';
import { formatCurrency, formatDateTime } from '../../../../utils/formatData';
import { Order } from '../../../../interface/Order';
import { useEffect, useState } from 'react';
import { getOrderByCode } from '../../../../api/order';
import { getProducts } from '../../../../api/product';

interface ProductOrder {
  productCode: string;
  images: { path: string }[];
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
  const [orderDetail, setOrderDetail] = useState<OrderDetail>({
    order: order,
    productOrders: [],
  } as OrderDetail);

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
      <View className='items-center'>
        <View style={viewStyles.orderCard}>
          <View style={viewStyles.flexRow} className='justify-between'>
            <View style={viewStyles.flexRow} className='mb-1'>
              <Text style={textStyles.label}>Mã đơn hàng:</Text>
              <Text style={textStyles.normal}>
                {orderDetail.order?.purrPetCode}
              </Text>
            </View>
            <View style={viewStyles.flexRow} className='mb-1'>
              <Text style={textStyles.label}>Trạng thái:</Text>
              <Text style={textStyles.normal}>{orderDetail.order?.status}</Text>
            </View>
          </View>
          <View style={viewStyles.flexRow} className='mb-1'>
            <Text style={textStyles.label}>Ngày đặt:</Text>
            <Text style={textStyles.normal}>
              {formatDateTime(orderDetail.order?.createdAt)}
            </Text>
          </View>
          <View style={viewStyles.flexRow}>
            <Text style={textStyles.label}>Ghi chú:</Text>
            <Text style={textStyles.normal}>
              {orderDetail.order?.customerNote}
            </Text>
          </View>
          <View style={viewStyles.line} />
          <View style={viewStyles.flexRow} className='mb-1'>
            <Text style={textStyles.label}>Họ tên:</Text>
            <Text style={textStyles.normal}>
              {orderDetail.order?.customerName}
            </Text>
          </View>
          <View style={viewStyles.flexRow} className='mb-1'>
            <Text style={textStyles.label}>Số điện thoại:</Text>
            <Text style={textStyles.normal}>
              {orderDetail.order?.customerPhone}
            </Text>
          </View>
          <View style={viewStyles.flexRow} className='mb-1'>
            <Text style={textStyles.label}>Email:</Text>
            <Text style={textStyles.normal}>
              {orderDetail.order?.customerEmail}
            </Text>
          </View>
          <View>
            <Text style={textStyles.label}>Địa chỉ nhận hàng:</Text>
            <Text style={textStyles.normal}>
              {orderDetail.order?.customerAddress.street},{' '}
              {orderDetail.order?.customerAddress.ward},{' '}
              {orderDetail.order?.customerAddress.district},{' '}
              {orderDetail.order?.customerAddress.province}
            </Text>
          </View>
        </View>
      </View>
      <View className='items-center'>
        <Text style={textStyles.label}>Danh sách sản phẩm</Text>
        {orderDetail.productOrders.map((productOrder, index) => (
          <View style={viewStyles.orderCard} key={index}>
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
                <Text style={textStyles.normal}>x{productOrder.quantity}</Text>
                <Text style={textStyles.normal}>
                  {formatCurrency(productOrder.price)}
                </Text>
              </View>
            </View>

            <View style={viewStyles.flexRow} className='justify-end'>
              <Text style={textStyles.label}>Thành tiền:</Text>
              <Text style={textStyles.normal}>
                {formatCurrency(productOrder.totalPrice)}
              </Text>
            </View>
          </View>
        ))}
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={viewStyles.scrollContainer}
      ></ScrollView>
    </SafeAreaView>
  );
};

export default OrderDetailScreen;
