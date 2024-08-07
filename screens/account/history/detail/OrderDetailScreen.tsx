import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import viewStyles from '../../../styles/ViewStyles';
import {
  ArrowLeftIcon,
  Spinner,
  Textarea,
  TextareaInput,
} from '@gluestack-ui/themed';
import textStyles from '../../../styles/TextStyles';
import { formatCurrency, formatDateTime } from '../../../../utils/formatData';
import { Order } from '../../../../interface/Order';
import React, { useEffect, useState } from 'react';
import { getOrderByCode, updateStatusOrder } from '../../../../api/order';
import { getProducts } from '../../../../api/product';
import { ChevronDownIcon, ChevronRightIcon } from 'lucide-react-native';
import buttonStyles from '../../../styles/ButtonStyles';
import * as CONST from '../../../constants';
import { StyleSheet } from 'react-native';
import { createPaymentUrl, requestRefund } from '../../../../api/pay';
import openInChrome from '../../../../utils/openInChrome';
import axios from 'axios';
import textInputStyles from '../../../styles/TextInputStyles';
import { MediaType, launchImageLibrary } from 'react-native-image-picker';
import { set } from 'date-fns';
import { useCustomerStore } from '../../../../zustand/customerStore';

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
  const [clickRefund, setClickRefund] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [message, setMessage] = useState('');
  const [picture, setPicture] = useState([] as any);
  const customer = useCustomerStore((state) => state.customerState.data);
  const [error, setError] = useState({
    message: '',

    picture: '',
  });

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
  }, [clickRefund]);
  const handleCancelOrder = () => {
    updateStatusOrder(
      orderDetail?.order?.purrPetCode as string,
      CONST.STATUS_ORDER.CANCEL,
    ).then((res) => {
      if (res.err === 0) {
        navigation.navigate('HistoryScreen');
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
      if (
        orderDetail?.order?.createdAt &&
        new Date().getTime() -
          new Date(orderDetail?.order?.createdAt).getTime() >
          86400000 * 7
      ) {
        setDisabled(true);
      } else {
        setDisabled(false);
      }
    }
  }, [orderDetail]);

  const handleReviewOrder = () => {
    console.log('handleReviewOrder');
    navigation.navigate('OrderReviewScreen', { order: orderDetail?.order });
  };
  const handlePay = () => {
    createPaymentUrl({
      orderCode: orderCode,
      returnUrl: 'vnpay-returnForMoblie',
    }).then((res) => {
      if (res.err === 0) {
        console.log('Đặt hàng thành công!');
        openInChrome(res.data.paymentUrl, navigation, customer);
      } else {
        console.log('error', res.message);
      }
    });
  };

  const handleRefund = () => {
    if (!message) {
      setError({ ...error, message: 'Vui lòng nhập lý do' });
      return;
    } else if (!picture) {
      setError({ ...error, picture: 'Vui lòng chọn ảnh' });
      return;
    }

    setError({
      ...error,
      message: '',
      picture: '',
    });

    requestRefund({
      orderCode: orderCode,
      message: message,
      images: picture,
    }).then((res) => {
      //api upload image
      console.log('res', res);
      if (res.err === 0) {
        console.log('Yêu cầu trả hàng thành công!');
        setPicture([]);
        setClickRefund(false);
        navigation.navigate('Sản phẩm');
      } else {
        console.log('error', res.message);
      }
    });
  };
  const pickFromGallery = async () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 2000,
        maxWidth: 2000,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('Image picker error: ', response.errorCode);
        } else {
          if (response.assets?.[0]?.uri) {
            const file = {
              uri: response.assets[0].uri,
              type: response.assets[0].type,
              name: response.assets[0].fileName,
            };
            handleUpload(file);
          }
        }
      },
    );
  };
  const handleUpload = (image: any) => {
    const data = new FormData();
    data.append('file', image);
    data.append('upload_preset', 'g2rusnuv');
    data.append('cloud_name', 'dmzahhttu');

    fetch('https://api.cloudinary.com/v1_1/dmzahhttu/image/upload', {
      method: 'POST',
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setPicture([...picture, data.url]);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  console.log('orderDetail', picture);

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
              {orderDetail?.order?.status === CONST.STATUS_ORDER.RETURN && (
                <View style={viewStyles.flexRow} className='mb-1'>
                  <Text style={textStyles.label}>Trạng thái trả hàng:</Text>
                  <Text style={textStyles.normal}>
                    {orderDetail?.order?.statusRefund}
                  </Text>
                </View>
              )}
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
                          product: {
                            purrPetCode: productOrder.productCode,
                            ...productOrder,
                          },
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
              <Text style={textStyles.label}>Thanh toán bằng xu:</Text>
              <Text style={textStyles.normal}>
                -{formatCurrency(orderDetail?.order?.useCoin || 0)}
              </Text>
            </View>
            <View style={viewStyles.flexRow} className='justify-between'>
              <Text style={textStyles.label}>Tổng thanh toán:</Text>
              <Text style={textStyles.normal}>
                {formatCurrency(orderDetail?.order?.totalPayment as number)}
              </Text>
            </View>
          </View>
          {(orderDetail?.order?.status === CONST.STATUS_ORDER.NEW ||
            orderDetail?.order?.status === CONST.STATUS_ORDER.PREPARE) && (
            <View style={viewStyles.flexRow} className='justify-around'>
              <TouchableOpacity
                style={buttonStyles.buttonOutline}
                onPress={() => handleCancelOrder()}
              >
                <Text style={styles.buttonOutlineText}>Huỷ đơn</Text>
              </TouchableOpacity>
              {orderDetail?.order?.payMethod === CONST.PAYMENT_METHOD.VNPAY &&
                orderDetail?.order?.paymentStatus ===
                  CONST.STATUS_PAYMENT.WAITING_FOR_PAY && (
                  <View>
                    <TouchableOpacity
                      style={buttonStyles.buttonOutline}
                      onPress={() => handlePay()}
                    >
                      <Text style={styles.buttonOutlineText}>Thanh toán</Text>
                    </TouchableOpacity>
                  </View>
                )}
            </View>
          )}

          {orderDetail?.order?.status === CONST.STATUS_ORDER.DONE &&
            !clickRefund && (
              <View style={viewStyles.flexRow} className='justify-around'>
                <TouchableOpacity
                  style={buttonStyles.buttonOutline}
                  onPress={() => handleReviewOrder()}
                >
                  <Text style={styles.buttonOutlineText}>Đánh giá</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    buttonStyles.buttonOutline,
                    disabled ? buttonStyles.disabledButtonOutline : null,
                  ]}
                  onPress={() => setClickRefund(true)}
                  disabled={disabled}
                >
                  <Text style={styles.buttonOutlineText}>
                    Yêu cầu trả hàng/Hoàn tiền
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          {clickRefund && (
            <View style={{ margin: 10 }}>
              <Text style={textStyles.label}>Lý do hoàn tiền</Text>
              <Textarea
                size='md'
                isReadOnly={false}
                isInvalid={false}
                isDisabled={false}
                w='100%'
                marginTop={10}
                marginBottom={10}
              >
                <TextareaInput
                  placeholder='Vui lòng nhập lý do trả hàng hoàn tiền....'
                  value={message}
                  onChangeText={(value) => setMessage(value)}
                />
                <Text style={textStyles.error}>{error.message}</Text>
              </Textarea>
              <View>
                <TouchableOpacity
                  style={[buttonStyles.button, { width: '40%', marginTop: 10 }]}
                  onPress={() => pickFromGallery()}
                >
                  <Text style={{ color: '#ffffff', alignSelf: 'center' }}>
                    Chọn ảnh
                  </Text>
                </TouchableOpacity>
                <View style={{ margin: 10 }}>
                  {picture.length > 0 &&
                    picture.map((item: any, index: number) => (
                      <Image
                        key={index}
                        source={{ uri: item }}
                        style={{ width: 100, height: 100, margin: 5 }}
                      />
                    ))}
                </View>
                <Text style={textStyles.error}>{error.picture}</Text>

                <TouchableOpacity
                  style={buttonStyles.buttonOutline}
                  onPress={() => handleRefund()}
                >
                  <Text
                    style={[styles.buttonOutlineText, { alignSelf: 'center' }]}
                  >
                    Gửi yêu cầu
                  </Text>
                </TouchableOpacity>
              </View>
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
    color: '#000000',
    marginHorizontal: 10,
  },
});

export default OrderDetailScreen;
