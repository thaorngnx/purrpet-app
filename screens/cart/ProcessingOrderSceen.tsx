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
import { ArrowLeftIcon } from '@gluestack-ui/themed';
import { ProductCartInfo } from '../../interface/Cart';
import { Image } from 'react-native';
import { formatCurrency } from '../../utils/formatData';
import textInputStyles from '../styles/TextInputStyles';
import { useEffect, useState } from 'react';
import { Customer } from '../../api/customer';

const ProcessingOrderSceen = ({ navigation, route }: any) => {
  const { productCart } = route.params;
  // const cart = useCartStore((state) => state.cartState.data);
  const customer = useCustomerStore((state) => state.customerState.data);
  const [customerInfo, setCustomerInfo] = useState<Customer>({} as Customer);

  useEffect(() => {
    setCustomerInfo(customer);
  }, [customer]);

  return (
    <SafeAreaView style={viewStyles.container} className='flex-1'>
      <View style={viewStyles.titlePageBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeftIcon />
        </TouchableOpacity>
        <Text style={textStyles.title}>Thông tin đặt hàng</Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={viewStyles.scrollContainer}
      >
        {Object.keys(customer).length != 0 ? (
          <View>
            <Text
              style={[
                textStyles.label,
                {
                  textAlign: 'center',
                },
              ]}
            >
              Thông tin khách hàng
            </Text>
            <View style={viewStyles.card}>
              <View>
                <View style={viewStyles.flexRow}>
                  <Text style={textStyles.label}>Tên khách hàng:</Text>
                  <Text style={[textStyles.normal, { flex: 1 }]}>
                    {customer.name}
                  </Text>
                </View>
                <View style={viewStyles.flexRow}>
                  <Text style={textStyles.label}>Số điện thoại:</Text>
                  <Text style={[textStyles.normal, { flex: 1 }]}>
                    {customer.phoneNumber}
                  </Text>
                </View>
                <View style={viewStyles.flexRow}>
                  <Text style={textStyles.label}>Địa chỉ:</Text>
                  <Text style={[textStyles.normal, { flex: 1 }]}>
                    {customer.address.street}, {customer.address.district},{' '}
                    {customer.address.province}
                  </Text>
                </View>
              </View>
            </View>
            <Text
              style={[
                textStyles.label,
                {
                  textAlign: 'center',
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
          </View>
        ) : (
          <View>
            <Text
              style={[
                textStyles.label,
                {
                  textAlign: 'center',
                },
              ]}
            >
              Thông tin khách hàng
            </Text>
            <View style={viewStyles.card}>
              <View>
                <Text style={textStyles.label}>Email:</Text>
                <TextInput
                  style={textInputStyles.textInputBorder}
                  value={customerInfo.email}
                  editable={false}
                />
              </View>
            </View>
          </View>
        )}
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
          onPress={() => navigation.navigate('OrderSuccess')}
        >
          <Text style={textStyles.bold}>Đặt hàng</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProcessingOrderSceen;
