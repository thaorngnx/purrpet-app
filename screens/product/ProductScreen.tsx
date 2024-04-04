import { useState, useEffect, useRef } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import SearchProduct from '../components/Search/SearchProduct';
import { Icon, ChevronDownIcon } from '@gluestack-ui/themed';
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
import { getActiveProducts } from '../../api/product';
import { Product } from '../../interface/Product';
import { Category } from '../../interface/Category';
import { v4 as uuidv4 } from 'uuid';
import ProductCard from '../components/Product/ProductCard';
import { Pagination } from '../../interface/Pagination';
import { useCategoryStore } from '../../zustand/categoryStore';

const ProductScreen = ({ navigation, route }: any) => {
  const categories: Category[] = useCategoryStore(
    (state) => state.categoryState.data,
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState({
    categoryName: '',
    purrPetCode: '',
  });
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    total: 1,
  } as Pagination);
  const [loading, setLoading] = useState(false);
  const [stopLoadMore, setStopLoadMore] = useState(true);

  useEffect(() => {
    setPagination({ page: 1, limit: 6, total: 1 });
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
    const params = {
      limit: 6,
      page: 1,
      key: search,
      // categoryCode: selectedCategory.purrPetCode,
    };
    console.log(params);
    getActiveProducts(params).then((res) => {
      setProducts(res.data);
      setPagination(res.pagination);
    });
  }, [search]);

  const handleLoadMore = async () => {
    console.log('handleLoadMore');
    setLoading(true);
    if (!stopLoadMore) {
      const params = {
        limit: 6,
        page: pagination.page + 1,
        key: search,
      };
      // console.log('params', params);

      try {
        await getActiveProducts(params).then((res) => {
          if (res.data.length > 0) {
            setProducts(products.concat(res.data));
            setPagination(res.pagination);
            setStopLoadMore(true);
          }
          setLoading(false);
        });
      } catch (error) {
        console.error(error);
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
    <SafeAreaView className='flex-1 w-max bg-white'>
      <View>
        <View style={styles.header}>
          <Text style={styles.text}>PurrPet Shop</Text>
          <Image
            source={require('../../assets/Purrshop1.png')}
            className='w-12 h-12 self-center'
          />
        </View>
        <View style={styles.search} className=' z-10'>
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
        // keyExtractor={(item) => item}
        onEndReached={() => {
          if (pagination.page < pagination.total) {
            handleLoadMore();
          }
        }}
        onEndReachedThreshold={0.5}
        onScrollBeginDrag={() => {
          setStopLoadMore(false);
        }}
        // key={uuidv4()}
        ListFooterComponent={
          loading ? (
            <View>
              <Text className=' text-black'>Loading...</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 94,
    backgroundColor: '#BAE6FD',
    padding: 10,
  },
  text: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  search: {
    position: 'absolute',
    marginTop: 70,
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '6%',
  },
  filter: {
    width: '40%',
    marginTop: 50,
    margin: 10,
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
