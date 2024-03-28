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
  ArrowLeftIcon,
  ChevronLeftIcon,
  Icon,
  Textarea,
  TextareaInput,
} from '@gluestack-ui/themed';
import { ProductCartInfo } from '../../interface/Cart';
import { Image } from 'react-native';
import { formatCurrency } from '../../utils/formatData';
import { useEffect, useState } from 'react';
import CustomerInfoOrder from './CustomerInfoOrder';
import { createOrder } from '../../api/order';

const ProcessingOrderSceen = ({ navigation, route }: any) => {
  const { productCart } = route.params;
  //const cart = useCartStore((state) => state.cartState.data);
  const { deleteCart } = useCartStore();
  const customer = useCustomerStore((state) => state.customerState.data);
  const hasCustomerInfo = Object.keys(customer).length > 0;
  const [customerInfo, setCustomerInfo] = useState(customer);
  const [customerNote, setCustomerNote] = useState('');

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
      customerNote: customerNote,
    }).then((res) => {
      if (res.err == 0) {
        console.log('Đặt hàng thành công');
        navigation.navigate('Sản phẩm');
        deleteCart();
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
  console.log(customerNote);
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
                      <Text style={textStyles.normal}>x{product.quantity}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
            <View style={{ margin: 10, padding: 5, backgroundColor: '#fff' }}>
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
          </View>
        )}
        {/* <View>
          <Text>Phương thức thanh toán</Text>
        </View> */}
      </ScrollView>

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
                  total + product.price * product.quantity,
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
          <Text style={textStyles.bold}>Đặt hàng</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProcessingOrderSceen;
