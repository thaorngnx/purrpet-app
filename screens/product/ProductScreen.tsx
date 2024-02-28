import { VStack } from '@gluestack-ui/themed';
import React, { useEffect } from 'react';
import {
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
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from '@gluestack-ui/themed';
import { getActiveCategories } from '../../api/category';
import * as CONST from '../constants';
import { getActiveProducts } from '../../api/product';

const ProductScreen = ({ navigation }: any) => {
  const [categories, setCategories] = React.useState([
    {
      categoryName: '',
      purrPetCode: '',
    },
  ]);
  const [products, setProducts] = React.useState([
    {
      _id: '',
      purrPetCode: '',
      productName: '',
      description: '',
      price: '',
      categoryCode: '',
      images: [
        {
          path: 'https://res.cloudinary.com/djjxfywxl/image/upload/v1701868560/purrpet/qu9ybdtkmfuzupzynp2h.webp',
        },
      ],
      inventory: '',
      star: '',
    },
  ]);
  const [selectedCategory, setSelectedCategory] = React.useState('');
  useEffect(() => {
    getActiveCategories({ categoryType: CONST.CATEGORY_TYPE.PRODUCT }).then(
      (res) => {
        setCategories(res.data);
      },
    );
    const params = {
      limit: 100,
      key: selectedCategory,
    };
    getActiveProducts(params).then((res) => {
      setProducts(res.data);
    });
  }, [selectedCategory]);

  const handleSelectCategory = (value: string) => {
    setSelectedCategory(value);
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
        <Select onValueChange={handleSelectCategory}>
          <SelectTrigger variant='underlined' size='md'>
            <SelectInput placeholder='Tất cả' />
            <Icon as={ChevronDownIcon} />
          </SelectTrigger>
          <SelectPortal>
            <SelectBackdrop />
            <SelectContent>
              <SelectDragIndicatorWrapper>
                <SelectDragIndicator />
              </SelectDragIndicatorWrapper>
              <SelectItem label='Tất cả' value='' />
              {categories.map((categories) => (
                <SelectItem
                  label={categories.categoryName}
                  value={categories.purrPetCode}
                />
              ))}
            </SelectContent>
          </SelectPortal>
        </Select>
      </View>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.row}>
          {products.map((product) => (
            <View key={product.purrPetCode} style={styles.column}>
              <Image
                source={{ uri: product.images[0]?.path }}
                style={[styles.image, { width: 146, height: 133 }]}
              />
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
    flex: 1,
  },
});

export default ProductScreen;
