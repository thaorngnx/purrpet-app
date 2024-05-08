import { useState, useEffect } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  ScrollView,
} from 'react-native';
import SearchProduct from '../components/Search/SearchProduct';
import { getActiveProducts, getProductBestSeller } from '../../api/product';
import { Product } from '../../interface/Product';
import textStyles from '../styles/TextStyles';
import { err } from 'react-native-svg';
import { v4 as uuidv4 } from 'uuid';
import ProductCard from '../components/Product/ProductCard';
import { TouchableOpacity } from 'react-native';
import viewStyles from '../styles/ViewStyles';
import { ChevronsRightIcon } from 'lucide-react-native';
import {
  clearRecentlyViewedProducts,
  getRecentlyViewedProducts,
} from '../../utils/productAsyncStorage';

const HomeScreen = ({ navigation, route }: any) => {
  const [bestSeller, setBestSeller] = useState<Product[]>([]);
  const [recentlyViewedProducts, setRecentlyViewedProducts] = useState<
    Product[]
  >([]);

  useEffect(() => {
    getProductBestSeller({}).then((res) => {
      if (res.data.length > 0) {
        setBestSeller(res.data);
      } else {
        err('Không có sản phẩm bán chạy');
      }
    });
    getRecentlyViewedProducts().then((res) => {
      setRecentlyViewedProducts(res);
    });
  }, []);

  const imageSpa = [
    {
      image: require('../../assets/cho1.jpg'),
    },
    {
      image: require('../../assets/cho2.jpg'),
    },
    {
      image: require('../../assets/cho3.jpg'),
    },
    {
      image: require('../../assets/cho4.jpg'),
    },
    {
      image: require('../../assets/cho5.jpg'),
    },
    {
      image: require('../../assets/cho6.jpg'),
    },
    {
      image: require('../../assets/cho7.jpg'),
    },
    {
      image: require('../../assets/cho8.jpg'),
    },
  ];
  const imageHomestay = [
    {
      image: require('../../assets/phong1.jpg'),
    },
    {
      image: require('../../assets/phong2.jpg'),
    },
    {
      image: require('../../assets/phong3.jpg'),
    },
    {
      image: require('../../assets/phong4.jpg'),
    },
    {
      image: require('../../assets/phong5.jpg'),
    },
    {
      image: require('../../assets/phong6.jpg'),
    },
    {
      image: require('../../assets/phong7.jpg'),
    },
    {
      image: require('../../assets/phong8.jpg'),
    },
  ];

  return (
    <SafeAreaView className=' bg-white'>
      <ScrollView>
        <View>
          <View>
            <Text
              style={{
                fontSize: 30,
                alignSelf: 'center',
                color: '#000000',
                fontWeight: 'bold',
                marginTop: 20,
              }}
            >
              Healthy & Tasty
            </Text>
            <Text
              style={{
                fontSize: 18,
                alignSelf: 'center',
                color: '#000000',
                fontWeight: 'bold',
                marginTop: 10,
              }}
            >
              Rest stop for your pet
            </Text>
          </View>
          <View style={styles.search}>
            <SearchProduct navigation={navigation} />
          </View>
          <View>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-around' }}
            >
              <TouchableOpacity onPress={() => navigation.navigate('Sản phẩm')}>
                <Image
                  source={require('../../assets/foodpet.jpg')}
                  style={styles.image}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('SpaScreen')}
              >
                <Image
                  source={require('../../assets/spapet.jpg')}
                  style={styles.image}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('HomeScreen')}
              >
                <Image
                  source={require('../../assets/homepet.jpg')}
                  style={styles.image}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.content1}>
              <View style={{ margin: 10, width: '50%', alignItems: 'center' }}>
                <Text
                  style={{ color: '#4572E7', fontWeight: 'bold', fontSize: 18 }}
                >
                  PurrPet Food
                </Text>
                <Text
                  style={{
                    color: '#000000',
                    textAlign: 'center',
                    marginTop: 4,
                  }}
                >
                  Dinh dưỡng hàng đầu cho bạn thân bốn chân của bạn
                </Text>
              </View>
              <Image
                source={require('../../assets/food.jpg')}
                style={{
                  width: 160,
                  height: 80,
                  alignSelf: 'center',
                  objectFit: 'contain',
                }}
              />
            </View>
            {bestSeller.length > 0 && (
              <View className='border-t border-b border-cyan-600'>
                <View style={viewStyles.flexRow} className='items-center'>
                  <Text style={textStyles.title}>Sản phẩm bán chạy</Text>
                </View>
                <FlatList
                  data={bestSeller}
                  renderItem={({ item }) => (
                    <ProductCard
                      product={item}
                      navigation={navigation}
                      productKey={uuidv4()}
                    />
                  )}
                  horizontal
                  keyExtractor={() => uuidv4()}
                  contentContainerStyle={styles.flatContainer}
                  showsHorizontalScrollIndicator={false}
                />
                <TouchableOpacity
                  style={viewStyles.flexRow}
                  className='self-center mt-2 mb-2'
                  onPress={() => navigation.navigate('Sản phẩm')}
                >
                  <Text className='mr-1 text-[#000000] text-sx'>Xem thêm</Text>
                  <ChevronsRightIcon color='#000000' />
                </TouchableOpacity>
              </View>
            )}
            <View>
              <View border-t border-b border-cyan-600>
                {recentlyViewedProducts.length > 0 && (
                  <View>
                    <View className='items-center'>
                      <Text style={textStyles.title}>
                        Sản phẩm đã xem gần đây
                      </Text>
                      <FlatList
                        data={recentlyViewedProducts}
                        renderItem={({ item }) => (
                          <ProductCard
                            product={item}
                            navigation={navigation}
                            productKey={uuidv4()}
                          />
                        )}
                        horizontal
                        keyExtractor={() => uuidv4()}
                        contentContainerStyle={styles.flatContainer}
                        showsHorizontalScrollIndicator={false}
                      />
                    </View>
                  </View>
                )}
              </View>
              <Image
                source={require('../../assets/petgrooming.jpg')}
                style={{
                  width: 160,
                  height: 80,
                  alignSelf: 'center',
                  marginTop: 10,
                }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  marginBottom: 20,
                }}
              >
                <Image
                  source={require('../../assets/image14.jpg')}
                  style={{ width: 120, height: 120 }}
                />
                <View
                  style={{
                    width: 230,
                    height: 82,
                    backgroundColor: '#FFE4E6',
                    padding: 20,
                    borderRadius: 8,
                    marginTop: 20,
                  }}
                >
                  <Text style={textStyles.hint}>
                    Gồm nhiều dịch vụ spa cho chó mèo cao cấp tại PurrPet
                  </Text>
                </View>
              </View>
              <View>
                <FlatList
                  data={imageSpa}
                  renderItem={({ item }) => (
                    <Image
                      source={item.image}
                      style={{ width: 100, height: 100, margin: 5 }}
                    />
                  )}
                  horizontal
                  keyExtractor={() => uuidv4()}
                  contentContainerStyle={styles.flatContainer}
                  showsHorizontalScrollIndicator={false}
                />
              </View>
            </View>
            <View style={{ backgroundColor: '#BAE6FD', paddingBottom: 20 }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  marginTop: 20,
                  color: '#000000',
                  alignSelf: 'center',
                }}
              >
                HOMESTAY CHO THÚ CƯNG
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  marginBottom: 20,
                }}
              >
                <Text style={textStyles.hint} className='mt-5 mr-35 ml-10 '>
                  Kỳ nghỉ trọn vẹn cho chó mèo Homestay chất lượng và chăm sóc
                  chu đáo!
                </Text>
                <Image
                  source={require('../../assets/location.jpg')}
                  style={{
                    width: 84,
                    height: 100,
                    marginRight: 30,
                  }}
                />
              </View>
              <View>
                <FlatList
                  data={imageHomestay}
                  renderItem={({ item }) => (
                    <Image
                      source={item.image}
                      style={{ width: 100, height: 100, margin: 5 }}
                    />
                  )}
                  horizontal
                  keyExtractor={() => uuidv4()}
                  contentContainerStyle={styles.flatContainer}
                  showsHorizontalScrollIndicator={false}
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  search: {
    // position: 'absolute',
    // marginTop: 70,
    width: '100%',
  },
  image: {
    width: 100,
    height: 100,
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
  content1: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20,
    alignSelf: 'center',
    height: 108,
    width: 370,
    backgroundColor: '#BAE6FD',
    borderRadius: 11,
  },
});

export default HomeScreen;
