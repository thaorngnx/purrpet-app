import { TouchableOpacity, View, Image, Text, StyleSheet } from 'react-native';
import { Product } from '../../../interface/Product';
import { ShoppingCart, StarIcon } from 'lucide-react-native';
import { formatCurrency } from '../../../utils/formatData';
import viewStyles from '../../styles/ViewStyles';

const ProductCard = ({
  navigation,
  product,
  productKey,
}: {
  navigation: any;
  product: Product;
  productKey: string;
}) => {
  if (!product || !product.images) {
    return <></>;
  }
  return (
    <View key={productKey} style={styles.productWrapper}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('DetailProductScreen', { product: product })
        }
      >
        <Image source={{ uri: product.images[0].path }} style={styles.image} />
        <Text style={styles.name} numberOfLines={2} className='truncate'>
          {product.productName}
        </Text>
      </TouchableOpacity>
      <Text style={styles.price}>{formatCurrency(product.price)}</Text>
      <View
        style={viewStyles.flexRow}
        className='flex justify-between items-end'
      >
        <Text style={styles.start} className='flex-row items-end'>
          {product.star} <StarIcon color='#C54600' />
        </Text>
        <ShoppingCart color='#C54600' />
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
  price: {
    marginTop: 5,
    fontSize: 15,
    color: '#C54600',
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
    borderColor: '#FDE047',
    borderWidth: 1,
    borderRadius: 5,
    margin: 5,
    // backgroundColor: '#FDE047',
  },
  flatContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProductCard;
