import { View, Text, FlatList, SafeAreaView, Image } from 'react-native';
import textStyles from '../styles/TextStyles';
import viewStyles from '../styles/ViewStyles';
import { useEffect, useState } from 'react';
import { getFavoriteProductDetail } from '../../api/favorite';
import { Product } from '../../interface/Product';
import { TouchableOpacity } from 'react-native';
import { ArrowLeftIcon, ChevronRightIcon } from 'lucide-react-native';
import { formatCurrency } from '../../utils/formatData';

const FavoriteProductScreen = ({ navigation }: any) => {
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);

  useEffect(() => {
    const params = {
      limit: 10,
      page: 1,
    };
    getFavoriteProductDetail(params).then((res) => {
      if (res.err === 0) {
        setFavoriteProducts(res.data);
      }
    });
  }, []);

  return (
    <SafeAreaView style={viewStyles.container}>
      <View style={viewStyles.titlePageBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeftIcon color='#2851a4' />
        </TouchableOpacity>
        <Text style={textStyles.title}>Sản phẩm yêu thích</Text>
      </View>
      <FlatList
        data={favoriteProducts}
        keyExtractor={(item) => item.purrPetCode.toString()}
        renderItem={({ item }) => (
          <View style={viewStyles.orderCard}>
            <View style={[viewStyles.flexRow, { flex: 1 }]}>
              <Image
                source={{ uri: item?.images[0]?.path }}
                style={{
                  width: 100,
                  height: 100,
                  objectFit: 'contain',
                  marginRight: 10,
                }}
              />
              <View style={[viewStyles.flexColumn, { flex: 1 }]}>
                <Text style={textStyles.label}>{item?.productName}</Text>
                <View
                  style={[
                    viewStyles.flexRow,
                    {
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginVertical: 8,
                    },
                  ]}
                >
                  <Text
                    className={
                      item.discountQuantity > 0
                        ? 'text-gray-500 line-through '
                        : 'font-bold  text-[#C54600] text-[15px]'
                    }
                  >
                    {formatCurrency(item.price)}
                  </Text>
                  {item.priceDiscount > 0 && (
                    <Text className='font-bold  text-[#C54600] text-[15px]'>
                      {formatCurrency(item.priceDiscount)}
                    </Text>
                  )}
                </View>
                {item.discountQuantity > 0 && (
                  <Text className=' text-gray-500 text-[15px] italic'>
                    Số lượng {item.discountQuantity}
                  </Text>
                )}
              </View>
            </View>
            <View style={viewStyles.flexRow} className='justify-end'>
              <TouchableOpacity
                style={viewStyles.flexRow}
                onPress={() =>
                  navigation.navigate('DetailProductScreen', {
                    product: item,
                  })
                }
              >
                <Text className='mr-1 text-[#60A5FA]'>Xem chi tiết</Text>
                <ChevronRightIcon color='#60A5FA' />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default FavoriteProductScreen;
