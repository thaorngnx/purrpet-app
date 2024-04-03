import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import viewStyles from '../../../styles/ViewStyles';
import { ArrowLeftIcon, Spinner } from '@gluestack-ui/themed';
import textStyles from '../../../styles/TextStyles';
import { formatCurrency, formatDateTime } from '../../../../utils/formatData';
import { Order } from '../../../../interface/Order';
import { useEffect, useState } from 'react';
import { getOrderByCode, updateStatusOrder } from '../../../../api/order';
import { getProducts } from '../../../../api/product';
import { ChevronRightIcon } from 'lucide-react-native';
import buttonStyles from '../../../styles/ButtonStyles';
import * as CONST from '../../../constants';
import { StyleSheet } from 'react-native';

interface ProductOrder {
  productCode: string;
  images: { path: string }[];
  name: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

interface OrderDetail {
  order?: Order;
  productOrders?: ProductOrder[];
}

const OrderDetailScreen = ({ navigation, route }: any) => {
  const orderCode = route.params.orderCode as string;
  const [orderDetail, setOrderDetail] = useState<OrderDetail>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrderByCode(orderCode).then((res) => {
      if (res.err === 0) {
        const order = res.data;
        const orderItems = res.data.orderItems;
        const productCodes: string[] = [];
        res.data.orderItems.forEach((item: any) => {
          productCodes.push(item.productCode);
        });
        getProducts({ productCodes: productCodes.toString() }).then((res) => {
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
                    star: null as any,
                  };
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
  const handleCancelOrder = () => {
    updateStatusOrder(
      orderDetail?.order?.purrPetCode as string,
      CONST.STATUS_ORDER.CANCEL,
    ).then((res) => {
      if (res.err === 0) {
        navigation.goBack();
      } else {
        console.log(res);
      }
    });
  };

  useEffect(() => {
    if (
      orderDetail?.order &&
      (orderDetail?.productOrders as ProductOrder[]).length > 0
    ) {
      setLoading(false);
    }
  }, [orderDetail]);

  const handleReviewOrder = () => {
    console.log('handleReviewOrder');
    navigation.navigate('OrderReviewScreen', { order: orderDetail?.order });
  };

  return (
    <SafeAreaView style={viewStyles.container}>
      <View style={viewStyles.titlePageBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeftIcon />
        </TouchableOpacity>
        <Text style={textStyles.title}>
          Chi tiết đơn hàng {orderDetail?.order?.purrPetCode}
        </Text>
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
                    {formatDateTime(orderDetail?.order?.createdAt)}
                  </Text>
                </View>
                <View style={viewStyles.flexRow} className='mb-1'>
                  <Text style={textStyles.label}>Trạng thái:</Text>
                  <Text style={textStyles.normal}>
                    {orderDetail?.order?.status}
                  </Text>
                </View>
              </View>
              <View style={viewStyles.flexRow}>
                <Text style={textStyles.label}>Ghi chú:</Text>
                <Text style={textStyles.normal}>
                  {orderDetail?.order?.customerNote}
                </Text>
              </View>
              <View style={viewStyles.line} />
              <View style={viewStyles.flexRow} className='mb-1'>
                <Text style={textStyles.label}>Người nhận:</Text>
                <Text style={textStyles.normal}>
                  {orderDetail?.order?.customerName}
                </Text>
              </View>
              <View style={viewStyles.flexRow} className='mb-1'>
                <Text style={textStyles.label}>Số điện thoại:</Text>
                <Text style={textStyles.normal}>
                  {orderDetail?.order?.customerPhone}
                </Text>
              </View>
              <View>
                <Text style={textStyles.label}>Địa chỉ nhận hàng:</Text>
                <Text style={textStyles.normal}>
                  {orderDetail?.order?.customerAddress.street},{' '}
                  {orderDetail?.order?.customerAddress.ward},{' '}
                  {orderDetail?.order?.customerAddress.district},{' '}
                  {orderDetail?.order?.customerAddress.province}
                </Text>
              </View>
              <View style={viewStyles.line} />
              <View style={viewStyles.flexRow} className='mb-1'>
                <Text style={textStyles.label}>Thông tin thanh toán:</Text>
                <Text style={textStyles.normal}>
                  {formatCurrency(orderDetail?.order?.totalPayment as number)}
                </Text>
              </View>
              <View style={viewStyles.flexRow} className='mb-1'>
                <Text style={textStyles.label}>Phương thức thanh toán:</Text>
                <Text style={textStyles.normal}>
                  {orderDetail?.order?.payMethod}
                </Text>
              </View>
              <View style={viewStyles.flexRow} className='mb-1'>
                <Text style={textStyles.label}>Trạng thái thanh toán:</Text>
                <Text style={textStyles.normal}>
                  {orderDetail?.order?.paymentStatus}
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
            {(orderDetail?.productOrders as ProductOrder[]).map(
              (productOrder, index) => (
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

                  <View style={viewStyles.flexRow} className='justify-end mt-2'>
                    <TouchableOpacity
                      style={viewStyles.flexRow}
                      onPress={() =>
                        navigation.navigate('DetailProductScreen', {
                          product: productOrder,
                        })
                      }
                    >
                      <Text className='mr-1 text-[#60A5FA]'>Xem chi tiết</Text>
                      <ChevronRightIcon color='#60A5FA' />
                    </TouchableOpacity>
                  </View>
                </View>
              ),
            )}
          </View>
          <View style={viewStyles.boxUnderline}>
            <View style={viewStyles.flexRow} className='justify-between'>
              <Text style={textStyles.label}>Tổng tiền:</Text>
              <Text style={textStyles.normal}>
                {formatCurrency(orderDetail?.order?.orderPrice as number)}
              </Text>
            </View>
            <View style={viewStyles.flexRow} className='justify-between'>
              <Text style={textStyles.label}>Điểm tích lũy sử dụng:</Text>
              <Text style={textStyles.normal}>
                -{formatCurrency(orderDetail?.order?.pointUsed || 0)}
              </Text>
            </View>
            <View style={viewStyles.flexRow} className='justify-between'>
              <Text style={textStyles.label}>Tổng thanh toán:</Text>
              <Text style={textStyles.normal}>
                {formatCurrency(
                  (orderDetail?.order?.totalPayment as number) ||
                    (orderDetail?.order?.orderPrice as number),
                )}
              </Text>
            </View>
          </View>
          {(orderDetail?.order?.status === CONST.STATUS_ORDER.NEW ||
            orderDetail?.order?.status === CONST.STATUS_ORDER.PREPARE) && (
            <View style={viewStyles.flexRow} className='justify-center'>
              <TouchableOpacity
                style={buttonStyles.buttonOutline}
                onPress={() => handleCancelOrder()}
              >
                <Text style={styles.buttonOutlineText}>Huỷ đơn</Text>
              </TouchableOpacity>
            </View>
          )}
          {orderDetail?.order?.status === CONST.STATUS_ORDER.DONE && (
            <View style={viewStyles.flexRow} className='justify-center'>
              <TouchableOpacity
                style={buttonStyles.buttonOutline}
                onPress={() => handleReviewOrder()}
              >
                <Text style={styles.buttonOutlineText}>Đánh giá</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  buttonOutlineText: {
    ...textStyles.bold,
    color: '#60A5FA',
    marginHorizontal: 10,
  },
});

export default OrderDetailScreen;
