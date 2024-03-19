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
import { getActiveCategories } from '../../api/category';
import * as CONST from '../constants';
import { getActiveProducts, getProductBestSeller } from '../../api/product';
import { Product } from '../../interface/Product';
import { Category } from '../../interface/Category';
import textStyles from '../styles/TextStyles';
import { err } from 'react-native-svg';
import { v4 as uuidv4 } from 'uuid';
import ProductCard from '../components/Product/ProductCard';
import { Pagination } from '../../interface/Pagination';
import { TouchableOpacity } from 'react-native';
import viewStyles from '../styles/ViewStyles';
import { ChevronRightIcon } from 'lucide-react-native';

const HomeScreen = ({ navigation, route }: any) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [bestSeller, setBestSeller] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState({
    categoryName: '',
    purrPetCode: '',
  });
  const [search, setSearch] = useState('');
  const [showFlatlist, setShowFlatlist] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    total: 1,
  } as Pagination);
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
      setPagination(res.pagination);
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

  const handleLoadMore = () => {
    console.log('handleLoadMore');
    if (!loading) {
      setLoading(false);
      if (pagination.page < pagination.total) {
        const params = {
          limit: 6,
          page: pagination.page + 1,
          key: search,
        };
        console.log(params);

        getActiveProducts(params).then((res) => {
          setProducts([...products, ...res.data]);
          setPagination(res.pagination);
        });
      }
    }
  };

  const sections = [
    {
      key: 'bestSeller',
      title: 'Sản phẩm bán chạy',
      data: bestSeller,
      renderHeader: (section: any) => (
        <View>
          <View style={viewStyles.flexRow} className='items-center'>
            <Text style={textStyles.title}>{section.title}</Text>
            <TouchableOpacity
              style={viewStyles.flexRow}
              onPress={() => navigation.navigate(section.screen)}
            >
              <Text className='mr-1 text-[#A16207]'>Xem thêm</Text>
              <ChevronRightIcon color='#A16207' />
            </TouchableOpacity>
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
        </View>
      ),
      show: showFlatlist,
      screen: 'ProductScreen',
    },
  ] as any;

  const visibleSection = sections.filter((section: any) => section.show) as any;

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
    <SafeAreaView className='flex-1 bg-white'>
      <View>
        <View style={styles.header}>
          <Text style={styles.text}>PurrPet Shop</Text>
          <Image
            source={require('../../assets/Purrshop1.png')}
            className='w-15 h-55 self-center'
          />
        </View>
        <View style={styles.search}>
          <SearchProduct navigation={navigation} />
        </View>
      </View>
      {bestSeller.length > 0 && products.length > 0 && (
        <SectionList
          sections={visibleSection}
          renderSectionHeader={({ section }) => section.renderHeader(section)}
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
    // position: 'absolute',
    // marginTop: 70,
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

export default HomeScreen;
