import { AddIcon, ArrowLeftIcon, RemoveIcon, View } from '@gluestack-ui/themed';
import React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import SearchProduct from '../components/Search/SearchProduct';
import { StyleSheet } from 'react-native';
import buttonStyles from '../styles/ButtonStyles';
import { formatCurrency } from '../../utils/formatData';
import textStyles from '../styles/TextStyles';

const DetailProductScreen = ({ navigation, route }: any) => {
  const [quantity, setQuantity] = React.useState(1);
  const { product } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeftIcon size='xl' color='#C54600' alignSelf='center' />
        </TouchableOpacity>
        <View style={styles.search}>
          <SearchProduct navigation={navigation} />
        </View>
      </View>
      <ScrollView style={styles.scrollView}>
        <View>
          <Image
            source={{ uri: product.images[0]?.path }}
            style={[
              styles.image,
              { width: '90%', height: 350, objectFit: 'contain' },
            ]}
          />
          <View style={styles.content}>
            <Text style={styles.name}>{product.productName}</Text>
            <View style={styles.count}>
              <Text style={styles.price}>{formatCurrency(product.price)}</Text>
              <View style={styles.button}>
                <View>
                  <TouchableOpacity
                    onPress={() => setQuantity(quantity - 1)}
                    disabled={quantity === 1}
                    style={[
                      buttonStyles.buttonIncrease,
                      quantity === 1 ? { backgroundColor: '#ccc' } : {},
                    ]}
                  >
                    <RemoveIcon size='xl' color='#fff' alignSelf='center' />
                  </TouchableOpacity>
                </View>
                <Text
                  style={{
                    fontSize: 20,
                    margin: 15,
                    alignSelf: 'center',
                    color: '#000',
                  }}
                >
                  {quantity}
                </Text>
                <View>
                  <TouchableOpacity
                    onPress={() => setQuantity(quantity + 1)}
                    disabled={quantity === product.inventory}
                    style={[
                      buttonStyles.buttonIncrease,
                      quantity === product.inventory
                        ? { backgroundColor: '#ccc' }
                        : {},
                    ]}
                  >
                    <AddIcon size='xl' color='#fff' alignSelf='center' />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View>
              <Text
                style={{
                  fontSize: 18,
                  color: '#A16207',
                  fontWeight: 'bold',
                  marginTop: 10,
                }}
              >
                Mô tả
              </Text>
              <Text style={textStyles.normal}>{product.description}</Text>
            </View>

            <Text style={{ marginTop: 10, marginBottom: 20 }}>
              {product.description}
            </Text>

            <View style={buttonStyles.buttonOutline}>
              <TouchableOpacity
                onPress={() => navigation.navigate('SearchScreen')}
              >
                <Text style={styles.textButton}>Thêm vào giỏ hàng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#BAE6FD',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    height: 70,
    alignItems: 'center',
  },
  search: {
    width: '100%',
    height: 70,
    paddingRight: 15,
  },
  image: {
    alignSelf: 'center',
  },
  content: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: '#000',
  },
  count: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  price: {
    marginTop: 5,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#C54600',
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scrollView: {
    flex: 1,
    height: 100,
  },
  textButton: {
    color: '#DC2626',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default DetailProductScreen;
