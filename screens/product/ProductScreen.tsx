import { VStack } from '@gluestack-ui/themed';
import React from 'react';
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
import MenuBottom from '../components/Menu/MenuBottom';

const ProductScreen = ({ navigation }: any) => {
  const [selected, setSelected] = React.useState(1);

  const categories = [
    {
      label: 'Thức ăn hạt',
      value: '1',
    },
    {
      label: 'Bánh thưởng',
      value: '2',
    },
    {
      label: 'Đồ chơi',
      value: '3',
    },
    {
      label: 'Pate',
      value: '4',
    },
  ];
  const products = [
    {
      id: 1,
      name: 'Pate Cá ngừ  cái hồi cho mèo',
      price: 20000,
      image:
        'https://res.cloudinary.com/djjxfywxl/image/upload/v1701969197/purrpet/ubq73unj7e6ndjtsu9dk.webp',
      start: 4.9,
    },
    {
      id: 2,
      name: 'Pate Mèo vị cá ngừ rắc phô mai dạng thạch NEKKO 70g',
      price: 100000,
      image:
        'https://res.cloudinary.com/djjxfywxl/image/upload/v1701868450/purrpet/ezrr3vbjb2mn591pl6ej.png',
      start: 5.0,
    },
    {
      id: 3,
      name: 'Pate Mèo vị cá ngừ rắc trứng hấp và rong biển dạng thạch NEKKO 70g',
      price: 50000,
      image:
        'https://res.cloudinary.com/djjxfywxl/image/upload/v1701868560/purrpet/qu9ybdtkmfuzupzynp2h.webp',
      start: 3.9,
    },
    {
      id: 4,
      name: 'Pate Ostech Cat cho mèo dạng thạch 400gr',
      price: 50000,
      image:
        'https://res.cloudinary.com/djjxfywxl/image/upload/v1701870045/purrpet/xdtrlludhqf3f6kuauyj.png',
      start: 4.5,
    },
    {
      id: 5,
      name: 'Pate Mèo vị cá ngừ rắc trứng hấp và rong biển dạng thạch NEKKO 70g',
      price: 50000,
      image:
        'https://res.cloudinary.com/djjxfywxl/image/upload/v1701868560/purrpet/qu9ybdtkmfuzupzynp2h.webp',
      start: 4.5,
    },
    {
      id: 6,
      name: 'Pate Ostech Cat cho mèo dạng thạch 400gr',
      price: 50000,
      image:
        'https://res.cloudinary.com/djjxfywxl/image/upload/v1701870045/purrpet/xdtrlludhqf3f6kuauyj.png',
      start: 4.5,
    },
  ];
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View>
        <View style={styles.header}>
          <Text style={styles.text}>PURRPET SHOP</Text>
          {/* <Image source={require('https://res.cloudinary.com/djjxfywxl/image/upload/v1701870045/purrpet/xdtrlludhqf3f6kuauyj.png')} style={{width: '15%', height: 55, alignSelf:'center'}}/> */}
        </View>
        <View style={styles.search}>
          <SearchProduct />
        </View>
      </View>
      <View style={styles.filter}>
        <Select>
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
              {categories.map((category) => (
                <SelectItem label={category.label} value={category.value} />
              ))}
            </SelectContent>
          </SelectPortal>
        </Select>
      </View>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.row}>
          {products.map((product) => (
            <View key={product.id} style={styles.column}>
              <Image
                source={{ uri: product.image }}
                style={[styles.image, { width: 146, height: 133 }]}
              />
              <Text
                style={styles.name}
                onPress={() => navigation.navigate('Chi tiết sản phẩm')}
              >
                {product.name}
              </Text>
              <Text style={styles.price}>{product.price} đ</Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Text style={styles.start}>
                  {product.start} <StarIcon color='#C54600' />
                </Text>
                <AddIcon color='#881337' size='xl' />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      {/* <MenuBottom selected={selected}/> */}
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
    //  backgroundColor: '#FDE047',
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
