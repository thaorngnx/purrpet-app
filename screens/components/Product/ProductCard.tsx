import { TouchableOpacity, View, Image, Text, StyleSheet } from 'react-native';
import { Product } from '../../../interface/Product';
import { Heart, ShoppingCart, StarIcon } from 'lucide-react-native';
import { formatCurrency } from '../../../utils/formatData';
import viewStyles from '../../styles/ViewStyles';
import { useCartStore } from '../../../zustand/cartStore';
import { useState } from 'react';
import { addRecentlyViewedProduct } from '../../../utils/productAsyncStorage';
import { favoriteProduct } from '../../../api/favorite';
import { useFavoriteStore } from '../../../zustand/favoriteStore';

const ProductCard = ({
  navigation,
  product,
  productKey,
}: {
  navigation: any;
  product: Product;
  productKey: string;
}) => {
  const { addToCart } = useCartStore();

  const favorite = useFavoriteStore((state) => state.listFavoriteState.data);
  const { favoriteProduct } = useFavoriteStore();

  const handleAddToCart = () => {
    addToCart({
      productCode: product.purrPetCode,
      quantity: 1,
    });
  };
  const handleFavorite = () => {
    favoriteProduct(product.purrPetCode);
  };

  if (!product || !product.images) {
    return <></>;
  }
  const handleClickProduct = () => {
    addRecentlyViewedProduct(product);
    navigation.navigate('DetailProductScreen', { product: product });
  };

  return (
    <View key={productKey} style={styles.productWrapper}>
      <TouchableOpacity onPress={() => handleClickProduct()}>
        <Image source={{ uri: product.images[0].path }} style={styles.image} />
        <Text style={styles.name} numberOfLines={2} className='truncate'>
          {product.productName}
        </Text>
      </TouchableOpacity>
      <View
        style={viewStyles.flexRow}
        className='flex justify-between items-center my-1'
      >
        <Text
          className={
            product.discountQuantity > 0
              ? 'text-gray-500 line-through '
              : 'font-bold  text-[#C54600] text-[15px]'
          }
        >
          {formatCurrency(product.price)}
        </Text>
        {product.priceDiscount > 0 && (
          <Text className='font-bold  text-[#C54600] text-[15px]'>
            {formatCurrency(product.priceDiscount)}
          </Text>
        )}
      </View>

      {product.priceDiscount > 0 && (
        <TouchableOpacity className='absolute right-2 top-3 bg-red-600 px-2 py-1 rounded-md'>
          <Text className='text-white font-bold'>
            - {((product.price - product.priceDiscount) / product.price) * 100}%
          </Text>
        </TouchableOpacity>
      )}
      {product.discountQuantity > 0 && (
        <Text className='text-gray-500'>
          Số lượng {product.discountQuantity}
        </Text>
      )}

      <View
        style={viewStyles.flexRow}
        className='flex justify-between items-center my-1'
      >
        <View style={viewStyles.flexRow}>
          <Text style={styles.start} className='flex-row items-center mr-1'>
            {product.averageRating ? product.averageRating : 0}
          </Text>
          <StarIcon color='#C54600' fill={'#C54600'} />
        </View>

        <TouchableOpacity onPress={() => handleAddToCart()}>
          <ShoppingCart color='#C54600' />
        </TouchableOpacity>
      </View>
      <View style={viewStyles.flexRow} className='flex justify-between'>
        <TouchableOpacity onPress={() => handleFavorite()}>
          {favorite?.findIndex((item) => item === product.purrPetCode) ===
          -1 ? (
            <Heart color='#C54600' />
          ) : (
            <Heart color='#C54600' fill='#C54600' />
          )}
        </TouchableOpacity>
        <Text style={styles.totalSale}>Đã bán {product.orderQuantity}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    color: '#C54600',
    fontWeight: 'bold',
    fontStyle: 'italic',
    alignSelf: 'center',
  },
  name: {
    marginTop: 5,
    fontSize: 15,
    color: 'black',
  },

  start: {
    marginTop: 5,
    fontSize: 15,
    color: '#C54600',
  },
  image: {
    width: 165,
    height: 160,
    alignSelf: 'center',
    objectFit: 'contain',
  },
  productWrapper: {
    width: 178,
    padding: 10,
    borderRadius: 5,
    margin: 5,
    backgroundColor: '#FFE4E6',
  },
  flatContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalSale: {
    fontSize: 12,
    color: 'black',
    textAlign: 'right',
    marginTop: 5,
  },
});

export default ProductCard;
