import { useState, useEffect } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  SectionList,
} from 'react-native';
import SearchProduct from '../components/Search/SearchProduct';
import {
  Icon,
  ChevronDownIcon,
  StarIcon,
  Spinner,
  SelectIcon,
} from '@gluestack-ui/themed';
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
import { v4 as uuidv4 } from 'uuid';
import ProductCard from '../components/Product/ProductCard';
import { TouchableOpacity } from 'react-native';
import { ArrowLeftIcon } from '@gluestack-ui/themed';
import viewStyles from '../styles/ViewStyles';

const ProductScreen = ({ navigation, route }: any) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState({
    categoryName: '',
    purrPetCode: '',
  });
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    totalPage: 1,
  });
  const [loading, setLoading] = useState(false);

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
      limit: 6,
      page: pagination.page,
      key: search,
    };
    console.log(params);
    getActiveProducts(params).then((res) => {
      setProducts(res.data);
      setPagination({ ...pagination, totalPage: res.totalPage });
    });
  }, [search]);

  const handleLoadMore = () => {
    console.log('handleLoadMore');
    if (!loading) {
      setLoading(false);
      if (pagination.page <= pagination.totalPage) {
        const params = {
          limit: 6,
          page: pagination.page + 1,
          key: search,
        };
        console.log(params);

        getActiveProducts(params).then((res) => {
          setProducts([...products, ...res.data]);
          setPagination({
            ...pagination,
            page: pagination.page + 1,
            totalPage: res.totalPage,
          });
        });
      }
    }
  };

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
    <SafeAreaView className='h-screen w-max bg-white'>
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
      <View style={styles.filter}>
        <Select
          onValueChange={handleSelectCategory}
          selectedValue={selectedCategory.purrPetCode}
        >
          <SelectTrigger variant='rounded' size='md' paddingRight={10}>
            <SelectInput
              placeholder='Tất cả'
              value={selectedCategory.categoryName}
              className='items-center text-center justify-center'
            />
            <Icon as={ChevronDownIcon} className='m-5' />
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
      <FlatList
        data={products}
        contentContainerStyle={styles.flatContainer}
        numColumns={2}
        renderItem={({ item }) => (
          <ProductCard
            navigation={navigation}
            product={item}
            productKey={uuidv4()}
          />
        )}
        keyExtractor={() => uuidv4()}
        onEndReached={() => handleLoadMore()}
        onEndReachedThreshold={1}
        // onScrollBeginDrag={() => {
        //   setLoading(true);
        // }}
        key={uuidv4()}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    height: 70,
    alignItems: 'center',
    backgroundColor: '#FDE047',
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '6%',
  },
  text: {
    fontSize: 18,
    color: '#C54600',
    fontWeight: 'bold',
    fontStyle: 'italic',
    alignSelf: 'center',
  },
  search: {
    width: '94%',
  },
  filter: {
    width: '40%',
    margin: 15,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 5,
    marginHorizontal: 7,
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
  scrollContainer: {
    marginTop: 10,
    flex: 1,
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

export default ProductScreen;
