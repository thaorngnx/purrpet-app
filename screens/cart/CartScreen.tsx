import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import SearchProduct from '../components/Search/SearchProduct';
import textStyles from '../styles/TextStyles';
import { useCartStore } from '../../zustand/cartStore';
import { useEffect, useState } from 'react';
import { getProductByCode } from '../../api/product';
import { formatCurrency } from '../../utils/formatData';
import viewStyles from '../styles/ViewStyles';
import { ProductCartInfo } from '../../interface/Cart';
import { ChevronRightIcon } from 'lucide-react-native';

const ProductCart = ({
  navigation,
  product,
}: {
  navigation: any;
  product: ProductCartInfo;
}) => {
  return (
    <View style={viewStyles.orderCard} className='flex'>
      <View style={viewStyles.flexRow} className='flex'>
        <Image
          source={{ uri: product?.images[0]?.path }}
          style={[viewStyles.historyImage, { flex: 1, aspectRatio: 1 }]}
        />
        <View style={{ flex: 3 }}>
          <Text
            style={textStyles.normal}
            numberOfLines={2}
            ellipsizeMode='tail'
          >
            {product.productName}
          </Text>
          <View className=' flex justify-end'>
            <Text style={textStyles.normal}>
              {formatCurrency(product.price)}
            </Text>

            <Text style={textStyles.normal}>Số lượng: {product.quantity}</Text>
            <Text style={textStyles.normal}>
              Thành tiền: {formatCurrency(product.totalPrice)}
            </Text>
          </View>
        </View>
      </View>
      <View style={viewStyles.flexRow} className='justify-end'>
        <TouchableOpacity
          style={viewStyles.flexRow}
          onPress={() => navigation.navigate('BookingHomeDetailScreen')}
        >
          <Text className='mr-1 text-[#A16207]'>Xem chi tiết</Text>
          <ChevronRightIcon color='#A16207' />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const CartScreen = ({ navigation }: any) => {
  const cart = useCartStore((state) => state.cartState.data);
  const { updateCart, deleteCart, deleteProductCart } = useCartStore();
  const [productCart, setProductCart] = useState<ProductCartInfo[]>([]);
  const [openCustomerInfoForm, setOpenCustomerInfoForm] = useState(false);
  const [showBtnConfirmOrder, setShowBtnConfirmOrder] = useState(false);

  useEffect(() => {
    if (cart.length === 0) {
      setProductCart([]);
      setShowBtnConfirmOrder(false);
      if (openCustomerInfoForm) {
        setOpenCustomerInfoForm(false);
      }
    } else {
      const fetchData = async () => {
        try {
          const productList = [];
          for (let i = 0; i < cart.length; i++) {
            const productData = await getProductByCode(cart[i].productCode);
            if (productData.data.inventory < cart[i].quantity) {
              deleteProductCart({ productCode: cart[i].productCode });
              continue;
            }

            productList.push({
              ...productData.data,
              quantity: cart[i].quantity,
              totalPrice: productData.data.price * cart[i].quantity,
            });
          }
          setProductCart(productList);
        } catch (error) {
          console.log(error);
        }
      };

      fetchData();
    }
  }, [cart]);

  return (
    <SafeAreaView style={{ backgroundColor: '#ffff', height: '100%' }}>
      <View style={styles.header}>
        <SearchProduct navigation={navigation} />
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={viewStyles.scrollContainer}
      >
        <View style={{ borderBottomWidth: 1 }}>
          <Text
            style={{
              alignSelf: 'center',
              color: '#000',
              fontWeight: 'bold',
              margin: 10,
            }}
          >
            Giỏ hàng của bạn
          </Text>
        </View>
        <View className='m-1 flex items-center flex-col'>
          {productCart.length > 0 &&
            productCart.map((product: any, index: number) => (
              <View key={index}>
                <ProductCart navigation={navigation} product={product} />
              </View>
            ))}
        </View>
        {showBtnConfirmOrder ? (
          <View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setOpenCustomerInfoForm(true)}
            >
              <Text
                style={{
                  alignSelf: 'center',
                  color: '#fff',
                  fontWeight: 'bold',
                  marginTop: 9,
                  fontSize: 16,
                }}
              >
                Tiến hành đặt hàng
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <Image
              source={require('../../assets/cart.png')}
              style={{ alignSelf: 'center', marginTop: 30 }}
            />
          </View>
        )}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Sản phẩm')}
        >
          <Text
            style={{
              alignSelf: 'center',
              color: '#fff',
              fontWeight: 'bold',
              marginTop: 9,
              fontSize: 16,
            }}
          >
            Tiếp tục mua sắm
          </Text>
        </TouchableOpacity>
        <View>
          <Text style={{ alignSelf: 'center' }}>
            Vẫn còn hơn 1000 sản phẩm đang chờ
          </Text>
          <Image
            source={require('../../assets/Frame1000002068.png')}
            style={{ alignSelf: 'center', marginTop: 10 }}
          />
          <Image
            source={require('../../assets/Frame1000002086.png')}
            style={{ alignSelf: 'center', marginTop: 10 }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FDE047',
    height: 70,
  },
  button: {
    backgroundColor: '#CA8A04',
    width: '50%',
    height: 40,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 20,
  },
});

export default CartScreen;
