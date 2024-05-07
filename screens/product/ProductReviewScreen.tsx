import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import viewStyles from '../styles/ViewStyles';
import textStyles from '../styles/TextStyles';
import { ArrowLeftIcon } from '@gluestack-ui/themed';
import ReviewCard from '../components/Review/ReviewCard';
import { useEffect, useState } from 'react';
import { getReviewByProduct } from '../../api/review';
import { v4 as uuidv4 } from 'uuid';
import { StyleSheet } from 'react-native';
import { Review } from '../../interface/Product';
import { Star } from 'lucide-react-native';
import { Pagination } from '../../interface/Pagination';

const ProductReviewScreen = ({ navigation, route }: any) => {
  const [review, setReview] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [stopLoadMore, setStopLoadMore] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 15,
    total: 1,
  } as Pagination);

  useEffect(() => {
    const params = {
      limit: 15,
      page: 1,
    };
    getReviewByProduct(route.params.productCode, params).then((res) => {
      setReview(res.data);
    });
  }, []);

  const handleLoadMore = async () => {
    console.log('handleLoadMore');
    setLoading(true);
    if (!stopLoadMore) {
      const params = {
        limit: 15,
        page: pagination.page + 1,
      };
      // console.log('params', params);

      try {
        await getReviewByProduct(route.params.productCode, params).then(
          (res) => {
            if (res.data.length > 0) {
              setReview([...review, ...res.data]);
              setPagination(res.pagination);
              setStopLoadMore(true);
            }
            setLoading(false);
          },
        );
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <SafeAreaView style={viewStyles.container}>
      <View style={viewStyles.titlePageBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeftIcon />
        </TouchableOpacity>
        <Text style={textStyles.title}>Đánh giá</Text>
      </View>
      <FlatList
        data={review}
        contentContainerStyle={styles.flatContainer}
        renderItem={({ item }: { item: Review }) => (
          <ReviewCard review={item} />
        )}
        onEndReached={() => {
          if (pagination.page < pagination.total) {
            handleLoadMore();
          }
        }}
        onEndReachedThreshold={0.5}
        onScrollBeginDrag={() => {
          setStopLoadMore(false);
        }}
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
  flatContainer: {
    paddingHorizontal: 15,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
});

export default ProductReviewScreen;
