import { useState, useEffect } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  SectionList,
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

const HomeScreen = ({ navigation, route }: any) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [bestSeller, setBestSeller] = useState<Product[]>([]);

  const [showFlatlist, setShowFlatlist] = useState(false);

  useEffect(() => {
    getActiveProducts({}).then((res) => {
      setProducts(res.data);
    });
    getProductBestSeller({}).then((res) => {
      if (res.data.length > 0) {
        setBestSeller(res.data);
        setShowFlatlist(true);
      } else {
        err('Không có sản phẩm bán chạy');
      }
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
  const sectionSpa = [
    {
      key: 'spa',
      title: 'Trước và sau khi sử dung dịch vụ spa tại PurrPet',
      data: imageSpa,
      renderHeader: (section: any) => (
        <View>
          <FlatList
            data={section.data}
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
      ),
      show: true,
      screen: 'SpaScreen',
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
  const sectionHomestay = [
    {
      key: 'homestay',
      title: 'Phòng ở tại PurrPet',
      data: imageHomestay,
      renderHeader: (section: any) => (
        <View>
          <FlatList
            data={section.data}
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
      ),
      show: true,
      screen: 'HomestayScreen',
    },
  ];
  const sections = [
    {
      key: 'bestSeller',
      title: 'Sản phẩm bán chạy',
      data: bestSeller,
      renderHeader: (section: any) => (
        <View className='border rounded-md border-cyan-600'>
          <View style={viewStyles.flexRow} className='items-center'>
            <Text style={textStyles.title}>{section.title}</Text>
          </View>
          <FlatList
            data={section.data}
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
            onPress={() => navigation.navigate(section.screen)}
          >
            <Text className='mr-1 text-[#000000] text-sx'>Xem thêm</Text>
            <ChevronsRightIcon color='#000000' />
          </TouchableOpacity>
        </View>
      ),
      show: showFlatlist,
      screen: 'Sản phẩm',
    },
  ] as any;

  const visibleSection = sections.filter((section: any) => section.show) as any;

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

            {bestSeller.length > 0 && products.length > 0 && (
              <SectionList
                sections={visibleSection}
                renderSectionHeader={({ section }) =>
                  section.renderHeader(section)
                }
                renderItem={({ item }) => <></>}
                // horizontal
                keyExtractor={() => uuidv4()}
                contentContainerStyle={{
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                }}
                stickySectionHeadersEnabled={false} // Add this line to disable sticky section headers
              />
            )}
            <View>
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
              <SectionList
                sections={sectionSpa}
                renderSectionHeader={({ section }) =>
                  section.renderHeader(section)
                }
                renderItem={({ item }) => <></>}
                // horizontal
                keyExtractor={() => uuidv4()}
                contentContainerStyle={{
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                }}
                stickySectionHeadersEnabled={false} // Add this line to disable sticky section headers
              />
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
              <SectionList
                sections={sectionHomestay}
                renderSectionHeader={({ section }) =>
                  section.renderHeader(section)
                }
                renderItem={({ item }) => <></>}
                // horizontal
                keyExtractor={() => uuidv4()}
                contentContainerStyle={{
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                }}
                stickySectionHeadersEnabled={false} // Add this line to disable sticky section headers
              />
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
