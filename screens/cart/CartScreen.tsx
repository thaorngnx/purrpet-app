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
import { ChevronRightIcon, Minus, Plus, Trash2 } from 'lucide-react-native';
import buttonStyles from '../styles/ButtonStyles';

const ProductCart = ({
  navigation,
  product,
}: {
  navigation: any;
  product: ProductCartInfo;
}) => {
  const { updateCart, deleteCart, deleteProductCart } = useCartStore();
  return (
    <View style={[viewStyles.orderCard, { marginVertical: 5 }]}>
      <View style={viewStyles.flexRow}>
        <Image
          source={{ uri: product?.images[0]?.path }}
          style={[viewStyles.historyImage, { flex: 1, aspectRatio: 1 }]}
        />
        <View style={{ flex: 3 }}>
          <View style={[viewStyles.flexRow]} className='justify-between'>
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
            <TouchableOpacity
              style={viewStyles.flexRow}
              onPress={() =>
                deleteProductCart({ productCode: product.purrPetCode })
              }
            >
              <Trash2 size={20} strokeWidth={1.5} color='#c81414' />
            </TouchableOpacity>
          </View>

          <View style={viewStyles.flexRow} className='justify-between'>
            <Text
              style={
                product.discountQuantity
                  ? [{ textDecorationLine: 'line-through' }, textStyles.normal]
                  : textStyles.normal
              }
            >
              {formatCurrency(product.price)}
            </Text>
            {product.discountQuantity && (
              <Text style={textStyles.normal}>
                {formatCurrency(product.priceDiscount)}
              </Text>
            )}
            <View style={viewStyles.flexRow}>
              <View style={viewStyles.flexRow} className='items-center'>
                <TouchableOpacity
                  style={[styles.changeQuantity, { marginRight: 10 }]}
                  onPress={() =>
                    updateCart({
                      productCode: product.purrPetCode,
                      quantity: product.quantity - 1,
                    })
                  }
                  disabled={product.quantity === 1}
                >
                  <Minus size={16} color={'black'} />
                </TouchableOpacity>
                <Text style={textStyles.normal}>{product.quantity}</Text>
                <TouchableOpacity
                  style={[styles.changeQuantity, { marginLeft: 10 }]}
                  onPress={() =>
                    updateCart({
                      productCode: product.purrPetCode,
                      quantity: product.quantity + 1,
                    })
                  }
                  disabled={
                    product.quantity ===
                    (product.discountQuantity
                      ? product.discountQuantity
                      : product.inventory)
                  }
                >
                  <Plus size={16} color={'black'} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View style={viewStyles.flexRow} className='justify-end pt-1'>
        <TouchableOpacity
          style={viewStyles.flexRow}
          onPress={() =>
            navigation.navigate('DetailProductScreen', { product })
          }
        >
          <Text className='mr-1 text-[#60A5FA]'>Xem chi tiết</Text>
          <ChevronRightIcon color='#60A5FA' />
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
    if (cart?.length === 0) {
      setProductCart([]);
      setShowBtnConfirmOrder(false);
      if (openCustomerInfoForm) {
        setOpenCustomerInfoForm(false);
      }
    } else {
      const fetchData = async () => {
        try {
          const productList = [];
          for (let i = 0; i < cart?.length; i++) {
            const productData = await getProductByCode(cart[i].productCode);
            const price = productData.data.discountQuantity
              ? productData.data.priceDiscount
              : productData.data.price;
            const inventory = productData.data.discountQuantity
              ? productData.data.discountQuantity
              : productData.data.inventory;
            if (inventory < cart[i].quantity) {
              deleteProductCart({ productCode: cart[i].productCode });
              continue;
            }

            productList.push({
              ...productData.data,
              quantity: cart[i].quantity,
              totalPrice: price * cart[i].quantity,
            });
          }
          setProductCart(productList);
          setShowBtnConfirmOrder(true);
        } catch (error) {
          console.log(error);
        }
      };

      fetchData();
    }
  }, [cart]);

  const handleOrder = () => {
    navigation.navigate('ProcessingOrderSceen', { productCart });
  };

  return (
    <SafeAreaView style={viewStyles.container}>
      <View style={viewStyles.titlePageBar}>
        <Text style={textStyles.title}>Giỏ hàng</Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={viewStyles.scrollContainer}
      >
        {productCart?.length > 0 ? (
          <View>
            {productCart?.length > 0 &&
              productCart?.map((product: any, index: number) => (
                <View key={index}>
                  <ProductCart navigation={navigation} product={product} />
                </View>
              ))}
          </View>
        ) : (
          <View>
            <Image
              source={require('../../assets/cart.png')}
              style={{ alignSelf: 'center', marginTop: 30 }}
            />
            <View style={buttonStyles.buttonWrapper}>
              <TouchableOpacity
                style={buttonStyles.button}
                onPress={() => navigation.navigate('Sản phẩm')}
              >
                <Text style={buttonStyles.buttonText}>Tiếp tục mua sắm</Text>
              </TouchableOpacity>
            </View>
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
          </View>
        )}
      </ScrollView>
      {showBtnConfirmOrder && (
        <View style={styles.totalBar}>
          <View
            style={[
              viewStyles.flexRow,
              {
                justifyContent: 'space-between',
              },
            ]}
          >
            <Text style={textStyles.label}>Tổng cộng:</Text>
            <Text style={textStyles.normal}>
              {formatCurrency(
                productCart.reduce(
                  (total, product) => total + product.totalPrice,
                  0,
                ),
              )}
            </Text>
          </View>
          <View style={buttonStyles.buttonWrapper}>
            <TouchableOpacity
              style={[buttonStyles.button, { width: '100%' }]}
              onPress={() => handleOrder()}
            >
              <Text style={buttonStyles.buttonText}>Tiến hành đặt hàng</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  totalBar: {
    padding: 10,
  },
  changeQuantity: {
    height: 25,
    width: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 7,
  },
});

export default CartScreen;
