import { VStack } from '@gluestack-ui/themed';
import React, { useEffect } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import SearchProduct from '../components/Search/SearchProduct';
import { Icon, ChevronDownIcon, StarIcon, AddIcon } from '@gluestack-ui/themed';
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from '@gluestack-ui/themed';
import { getActiveCategories } from '../../api/category';
import * as CONST from '../constants';
import { getActiveProducts, getProductBestSeller } from '../../api/product';
import { Product } from '../../interface/Product';
import { Category } from '../../interface/Category';
import textStyles from '../styles/TextStyles';
import { err } from 'react-native-svg';

const ProductScreen = ({ navigation, route }: any) => {
  const [categories, setCategories] = React.useState([{} as Category]);
  const [products, setProducts] = React.useState([{} as Product]);
  const [bestSeller, setBestSeller] = React.useState([{} as Product]);
  const [selectedCategory, setSelectedCategory] = React.useState({
    categoryName: '',
    purrPetCode: '',
  });
  const [search, setSearch] = React.useState('');
  const [showFlatlist, setShowFlatlist] = React.useState(false);
  useEffect(() => {
    if (route.params?.category) {
      const { category } = route.params;
      setSearch(category.purrPetCode);
      setSelectedCategory({
        categoryName: category.categoryName,
        purrPetCode: category.purrPetCode,
      });
    } else if (route.params?.search) {
      setSearch(route.params.search);
      setSelectedCategory({
        categoryName: '',
        purrPetCode: '',
      });
    }
  }, [route.params?.category, route.params?.search]);

  useEffect(() => {
    getActiveCategories({ categoryType: CONST.CATEGORY_TYPE.PRODUCT }).then(
      (res) => {
        setCategories(res.data);
      },
    );
    const params = {
      limit: 100,
      key: search,
    };
    console.log(params);
    getActiveProducts(params).then((res) => {
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
  }, [search]);

  const handleSelectCategory = (value: string) => {
    if (value === '') {
      setSearch('');
      setSelectedCategory({
        categoryName: '',
        purrPetCode: '',
      });
    } else {
      setSearch(value);
      const category = categories.find(
        (category) => category.purrPetCode === value,
      );
      if (category) {
        setSelectedCategory({
          categoryName: category.categoryName,
          purrPetCode: category.purrPetCode,
        });
      }
    }
  };

  return (
    <SafeAreaView className='flex-1'>
      <View>
        <View style={styles.header}>
          <Text style={styles.text}>PURRPET SHOP</Text>
          <Image
            source={require('../../assets/Purrshop1.png')}
            className='w-15 h-55 self-center'
          />
        </View>
        <View style={styles.search}>
          <SearchProduct navigation={navigation} />
        </View>
      </View>
      <View style={styles.filter}>
        <Select
          onValueChange={handleSelectCategory}
          selectedValue={selectedCategory.purrPetCode}
        >
          <SelectTrigger variant='underlined' size='md'>
            <SelectInput
              placeholder='Tất cả'
              value={selectedCategory.categoryName}
            />
            <Icon as={ChevronDownIcon} />
          </SelectTrigger>
          <SelectPortal>
            <SelectBackdrop />
            <SelectContent>
              <SelectDragIndicatorWrapper>
                <SelectDragIndicator />
              </SelectDragIndicatorWrapper>
              <SelectItem label='Tất cả' value='' />
              {categories.map((categories, index) => (
                <SelectItem
                  key={index}
                  label={categories.categoryName}
                  value={categories.purrPetCode}
                />
              ))}
            </SelectContent>
          </SelectPortal>
        </Select>
      </View>
      <ScrollView style={styles.scrollContainer}>
        <View style={{ margin: 20, borderColor: '#FDE047', borderWidth: 2 }}>
          <Text style={textStyles.title}>SẢN PHẨM BÁN CHẠY</Text>
          {showFlatlist && (
            <FlatList
              data={bestSeller}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View>
                  <View style={styles.flastlist}>
                    <Image
                      source={{ uri: item.images[0].path }}
                      style={[styles.image, { width: '100%', height: 133 }]}
                    />
                    <Text
                      style={styles.name}
                      onPress={() =>
                        navigation.navigate('DetailProductScreen', {
                          product: item,
                        })
                      }
                    >
                      {item.productName}
                    </Text>
                    <Text style={styles.price}>{item.price} đ</Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Text style={styles.start}>
                        {item.star} <StarIcon color='#C54600' />
                      </Text>
                      <Image
                        source={require('../../assets/iconAddCart.png')}
                        className='w-{20} h-{20}'
                      />
                    </View>
                  </View>
                </View>
              )}
              horizontal={true}
            />
          )}
        </View>
        <Text style={textStyles.title}>SẢN PHẨM CỦA CỬA HÀNG</Text>

        <View style={styles.row}>
          {products.map((product, index) => (
            <View key={index} style={styles.column}>
              {product.images && product.images.length > 0 && (
                <Image
                  source={{ uri: product.images[0].path }}
                  style={[styles.image, { width: 146, height: 133 }]}
                />
              )}
              <Text
                style={styles.name}
                onPress={() =>
                  navigation.navigate('DetailProductScreen', { product })
                }
              >
                {product.productName}
              </Text>
              <Text style={styles.price}>{product.price} đ</Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Text style={styles.start}>
                  {product.star} <StarIcon color='#C54600' />
                </Text>
                <Image
                  source={require('../../assets/iconAddCart.png')}
                  className='w-{20} h-{20}'
                />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 94,
    backgroundColor: '#FDE047',
    padding: 10,
  },
  text: {
    fontSize: 18,
    color: '#C54600',
    fontWeight: 'bold',
    fontStyle: 'italic',
    alignSelf: 'center',
  },
  search: {
    position: 'absolute',
    marginTop: 70,
    width: '100%',
  },
  filter: {
    marginTop: 40,
    width: '30%',
    marginLeft: 10,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    margin: 10,
    marginBottom: 50,
  },
  column: {
    width: '48%',
    padding: 10,
    borderColor: '#FDE047',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  name: {
    marginTop: 5,
    fontSize: 15,
    color: '#000',
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
    alignSelf: 'center',
  },
  scrollContainer: {
    marginTop: 10,
    flex: 1,
  },
  flastlist: {
    width: 170,
    height: 270,
    padding: 5,
    borderColor: '#FDE047',
    borderWidth: 1,
    borderRadius: 5,
    margin: 5,
    backgroundColor: '#FDE047',
  },
});

export default ProductScreen;
