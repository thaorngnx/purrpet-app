import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import viewStyles from '../styles/ViewStyles';
import { useCartStore } from '../../zustand/cartStore';
import textStyles from '../styles/TextStyles';
import { useCustomerStore } from '../../zustand/customerStore';
import {
  ChevronLeftIcon,
  CircleIcon,
  Icon,
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
  Textarea,
  TextareaInput,
} from '@gluestack-ui/themed';
import { ProductCartInfo } from '../../interface/Cart';
import { Image } from 'react-native';
import { formatCurrency } from '../../utils/formatData';
import { useEffect, useState } from 'react';
import CustomerInfoOrder from './CustomerInfoOrder';
import { createOrder } from '../../api/order';
import textInputStyles from '../styles/TextInputStyles';
import { createPaymentUrl } from '../../api/pay';
import openInChrome from '../../utils/openInChrome';
import * as CONST from '../constants';
import { Banknote } from 'lucide-react-native';

const ProcessingOrderSceen = ({ navigation, route }: any) => {
  const { productCart } = route.params;
  //const cart = useCartStore((state) => state.cartState.data);
  const { deleteCart } = useCartStore();
  const customer = useCustomerStore((state) => state.customerState.data);
  const hasCustomerInfo = Object.keys(customer).length > 0;
  const [customerInfo, setCustomerInfo] = useState(customer);
  const [customerNote, setCustomerNote] = useState('');
  const [userPoint, setUserPoint] = useState(0);
  const [error, setError] = useState({
    point: '',
  });
  const [payMethod, setPayMethod] = useState(CONST.PAYMENT_METHOD.COD);

  const handleOrder = () => {
    createOrder({
      customerCode: customerInfo.purrPetCode,
      orderItems: productCart.map((product: ProductCartInfo) => ({
        productCode: product.purrPetCode,
        quantity: product.quantity,
      })),
      customerAddress: {
        street: customerInfo.address.street,
        ward: customerInfo.address.ward,
        district: customerInfo.address.district,
        province: customerInfo.address.province,
      },
      userPoint: userPoint,
      customerNote: customerNote,
      payMethod: payMethod,
    }).then((res) => {
      console.log(res);
      if (res.err === 0) {
        if (payMethod === CONST.PAYMENT_METHOD.COD) {
          console.log('Đặt hàng thành công!');

          deleteCart();
          // navigation.navigate('OrderDetailScreen', {
          //   orderCode: res.data.purrPetCode,
          // });
          navigation.navigate('Sản phẩm');
        } else {
          createPaymentUrl({
            orderCode: res.data.purrPetCode,
          }).then((res) => {
            if (res.err === 0) {
              console.log('Đặt hàng thành công!');
              openInChrome(res.data.paymentUrl, navigation);
              deleteCart();
            }
          });
        }
      } else {
        console.log(res);
      }
    });
  };
  useEffect(() => {
    if (hasCustomerInfo) {
      setCustomerInfo(customer);
    }
  }, [customer]);

  const handleChangeNote = (event: any) => {
    const { text } = event.nativeEvent;
    setCustomerNote(text);
  };
  const handlePayment = (event: any) => {
    setPayMethod(event);
  };
  const handleChangePoint = (event: any) => {
    if (
      event <=
      productCart.reduce(
        (total: number, product: ProductCartInfo) =>
          total + product.price * product.quantity,
        0,
      ) /
        10
    ) {
      if (event > customer.point) {
        console.log('Số điểm không đủ');
        setError({
          ...error,
          point: 'Số điểm không đủ',
        });
      } else {
        setError({
          ...error,
          point: '',
        });
        setUserPoint(event);
      }
    } else {
      setError({
        ...error,
        point: 'Điểm tối đa có thể sử dụng là 10% giá trị đơn hàng',
      });
    }
  };
  return (
    <SafeAreaView style={viewStyles.container}>
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: '#BAE6FD',
          height: 50,
          alignItems: 'center',
        }}
      >
        <Text style={textStyles.title}>
          {hasCustomerInfo ? 'Đặt hàng' : 'Xác thực người dùng'}
        </Text>
      </View>
      <View>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            margin: 5,
            alignItems: 'center',
          }}
          onPress={() => navigation.goBack()}
        >
          <Icon as={ChevronLeftIcon} size='xl' marginRight={4} />
          <Text style={textStyles.hintBoldItalic}>Xem lại giỏ hàng</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={{ flex: 1 }}>
        <CustomerInfoOrder />
        {hasCustomerInfo && (
          <View>
            <View style={{ flex: 1, backgroundColor: '#fff', marginTop: 10 }}>
              <Text
                style={[
                  textStyles.label,
                  {
                    textAlign: 'center',
                    marginTop: 10,
                  },
                ]}
              >
                Chi tiết đơn hàng
              </Text>
              <View style={viewStyles.card}>
                {productCart.map((product: ProductCartInfo, index: number) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: 'row',
                      paddingVertical: 15,
                      alignItems: 'center',
                      borderBottomWidth: 1,
                      borderBottomColor: '#f0f0f0',
                    }}
                  >
                    <Image
                      source={{ uri: product?.images[0]?.path }}
                      style={[
                        viewStyles.historyImage,
                        { flex: 1, aspectRatio: 1 },
                      ]}
                    />
                    <View style={{ flex: 3 }}>
                      <View
                        style={[viewStyles.flexRow]}
                        className='justify-between'
                      >
                        <Text
                          style={{
                            ...textStyles.normal,
                            marginBottom: 5,
                            flex: 3,
                          }}
                          numberOfLines={2}
                          ellipsizeMode='tail'
                        >
                          {product.productName}
                        </Text>
                      </View>

                      <View
                        style={viewStyles.flexRow}
                        className='justify-between'
                      >
                        <Text style={textStyles.normal}>
                          {formatCurrency(product.price)}
                        </Text>
                        <Text style={textStyles.normal}>
                          x{product.quantity}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
            <View style={{ margin: 10, padding: 5, backgroundColor: '#fff' }}>
              <View
                style={[
                  viewStyles.flexRow,
                  { justifyContent: 'space-around', marginBottom: 10 },
                ]}
              >
                <Text style={textStyles.label}>Dùng điểm tích luỹ</Text>
                <Text style={textStyles.normal}>
                  Số điểm hiện có: {formatCurrency(customer.point)}
                </Text>
              </View>

              <TextInput
                style={textInputStyles.textInputBorder}
                keyboardType='numeric'
                value={userPoint.toString()}
                onChangeText={(event) => handleChangePoint(event)}
              />
              <Text style={textStyles.error}>{error.point}</Text>
            </View>
            <View style={{ padding: 10, backgroundColor: '#fff' }}>
              <Textarea
                size='md'
                isReadOnly={false}
                isInvalid={false}
                isDisabled={false}
                w='100%'
              >
                <TextareaInput
                  value={customerNote}
                  placeholder='Yêu cầu khác (nếu có)'
                  onChange={(event) => handleChangeNote(event)}
                />
              </Textarea>
            </View>
            <View>
              <View
                style={{ marginTop: 10, padding: 10, backgroundColor: '#fff' }}
              >
                <Text style={textStyles.label}>Phương thức thanh toán</Text>
                <RadioGroup
                  value={payMethod}
                  onChange={(value) => handlePayment(value)}
                >
                  <Radio
                    value={CONST.PAYMENT_METHOD.COD}
                    size='sm'
                    style={{ marginTop: 20 }}
                  >
                    <RadioIndicator mr='$2'>
                      <RadioIcon as={CircleIcon} />
                    </RadioIndicator>
                    <Banknote color='#000000' style={{ margin: 5 }} />
                    <Text style={textStyles.normal}>
                      {CONST.PAYMENT_METHOD.COD}
                    </Text>
                  </Radio>
                  <Radio
                    value={CONST.PAYMENT_METHOD.VNPAY}
                    size='sm'
                    style={{ marginTop: 20 }}
                  >
                    <RadioIndicator mr='$2'>
                      <RadioIcon as={CircleIcon} />
                    </RadioIndicator>

                    <Image
                      source={require('../../assets/vnpay.png')}
                      style={{ width: 45, height: 30 }}
                    />
                    <Text style={textStyles.normal}>
                      {CONST.PAYMENT_METHOD.VNPAY}
                    </Text>
                  </Radio>
                </RadioGroup>
              </View>
              <View
                style={{ marginTop: 10, padding: 15, backgroundColor: '#fff' }}
              >
                <View
                  style={[
                    viewStyles.flexRow,
                    { justifyContent: 'space-between' },
                  ]}
                >
                  <Text style={[textStyles.normal]}>Tổng tiền hàng:</Text>
                  <Text style={[textStyles.normal]}>
                    {' '}
                    {formatCurrency(
                      productCart.reduce(
                        (total: number, product: ProductCartInfo) =>
                          total + product.price * product.quantity,
                        0,
                      ),
                    )}
                  </Text>
                </View>
                <View
                  style={[
                    viewStyles.flexRow,
                    { marginTop: 5, justifyContent: 'space-between' },
                  ]}
                >
                  <Text style={[textStyles.normal]}>Sử dụng điểm:</Text>
                  <Text style={[textStyles.normal]}>
                    -{formatCurrency(userPoint) || 0}
                  </Text>
                </View>
              </View>

              <View
                style={[
                  viewStyles.flexRow,
                  {
                    justifyContent: 'space-between',
                    borderTopWidth: 1,
                    borderTopColor: '#f0f0f0',
                    alignItems: 'center',
                    height: 60,
                  },
                ]}
              >
                <View
                  style={[
                    viewStyles.flexColumn,
                    {
                      alignItems: 'flex-end',
                      flex: 3,
                      paddingHorizontal: 15,
                    },
                  ]}
                >
                  <Text style={textStyles.label}>Tổng thanh toán</Text>
                  <Text style={textStyles.normal}>
                    {formatCurrency(
                      productCart.reduce(
                        (total: number, product: ProductCartInfo) =>
                          total + product.price * product.quantity - userPoint,
                        0,
                      ),
                    )}
                  </Text>
                </View>
                <TouchableOpacity
                  style={{
                    backgroundColor: 'pink',
                    paddingLeft: 15,
                    height: '100%',
                    flex: 1,
                    justifyContent: 'center',
                  }}
                  onPress={() => handleOrder()}
                >
                  <Text style={textStyles.bold}>
                    {payMethod === 'VNPAY'
                      ? 'Tiến hành thanh toán '
                      : 'Đặt hàng'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProcessingOrderSceen;
