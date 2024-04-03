import { AddIcon, ArrowLeftIcon, RemoveIcon, View } from '@gluestack-ui/themed';
import React, { Fragment, useEffect } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import SearchProduct from '../components/Search/SearchProduct';
import { StyleSheet } from 'react-native';
import buttonStyles from '../styles/ButtonStyles';
import { formatCurrency } from '../../utils/formatData';
import textStyles from '../styles/TextStyles';
import { Star, StarHalf } from 'lucide-react-native';
import viewStyles from '../styles/ViewStyles';
import { Product, ProductDetail } from '../../interface/Product';
import { getProductDetailByCode } from '../../api/product';

const ratings = [
  { stars: 5, width: '65%', percent: '65%' },
  { stars: 4, width: '11%', percent: '11%' },
  { stars: 3, width: '14%', percent: '14%' },
  { stars: 2, width: '9%', percent: '9%' },
  { stars: 1, width: '1%', percent: '1%' },
];

const DetailProductScreen = ({ navigation, route }: any) => {
  const [quantity, setQuantity] = React.useState(1);
  const { product } = route.params;
  const [productDetail, setProductDetail] =
    React.useState<ProductDetail | null>(null);

  useEffect(() => {
    getProductDetailByCode(product.productCode).then((res) => {
      if (res.err === 0) {
        setProductDetail(res.data);
      }
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeftIcon size='xl' color='#C54600' alignSelf='center' />
        </TouchableOpacity>
        <View style={styles.search}>
          <SearchProduct navigation={navigation} />
        </View>
      </View>
      <ScrollView style={styles.scrollView}>
        <View>
          <Image
            source={{ uri: product.images[0]?.path }}
            style={[
              styles.image,
              { width: '90%', height: 350, objectFit: 'contain' },
            ]}
          />
          <View style={styles.content}>
            <Text style={styles.name}>
              {productDetail?.product.productName}
            </Text>

            <View style={styles.count}>
              <View
                style={[
                  viewStyles.flexRow,
                  {
                    alignItems: 'center',
                  },
                ]}
              >
                {(productDetail?.product.averageRating as number) > 0 ? (
                  <Fragment>
                    <Text
                      style={[
                        textStyles.title,
                        {
                          marginRight: 4,
                        },
                      ]}
                    >
                      {productDetail?.product.averageRating}
                    </Text>
                    {[
                      ...Array(
                        Math.ceil(
                          (productDetail?.product.averageRating as number) || 0,
                        ),
                      ),
                    ].map((star, index) => {
                      const isHalf =
                        index + 1 >
                        (productDetail?.product.averageRating as number);
                      return (
                        <Fragment key={index}>
                          {!isHalf ? (
                            <Star
                              fill={
                                index <
                                (productDetail?.product.averageRating as number)
                                  ? '#FFD700'
                                  : '#C0C0C0'
                              }
                              size={30}
                            />
                          ) : (
                            <StarHalf fill='#FFD700' size={30} />
                          )}
                        </Fragment>
                      );
                    })}
                    <Text
                      style={[
                        textStyles.hintBoldItalic,
                        {
                          color: '#d0021c',
                        },
                      ]}
                    >
                      ({productDetail?.rating.reviews.length} đánh giá)
                    </Text>
                  </Fragment>
                ) : (
                  <Fragment>
                    <Text
                      style={[
                        textStyles.title,
                        {
                          marginRight: 4,
                        },
                      ]}
                    >
                      0
                    </Text>
                    {[...Array(5)].map((star, index) => {
                      return <Star key={index} fill='#C0C0C0' size={30} />;
                    })}
                    <Text
                      style={[
                        textStyles.hintBoldItalic,
                        {
                          color: '#d0021c',
                        },
                      ]}
                    >
                      (0 đánh giá)
                    </Text>
                  </Fragment>
                )}
              </View>

              <Text style={styles.price}>{formatCurrency(product.price)}</Text>
            </View>
            <Text style={{ marginTop: 10, color: '#000000' }}>
              Đã bán {productDetail?.product.orderQuantity}
            </Text>

            <View>
              <Text
                style={{
                  fontSize: 18,
                  color: '#A16207',
                  fontWeight: 'bold',
                  marginTop: 10,
                }}
              >
                Mô tả
              </Text>
              <View>
                <Text style={textStyles.normal}>
                  {productDetail?.product.description}
                </Text>
              </View>
            </View>
            <View>
              <Text
                style={{
                  fontSize: 18,
                  color: '#A16207',
                  fontWeight: 'bold',
                  marginTop: 10,
                }}
              >
                Đánh giá sản phẩm
              </Text>
            </View>
            {(productDetail?.product.averageRating as number) > 0 && (
              <View style={styles.count}>
                <View
                  style={[
                    viewStyles.flexRow,
                    {
                      alignItems: 'center',
                    },
                  ]}
                >
                  <Text
                    style={[
                      textStyles.title,
                      {
                        marginRight: 2,
                      },
                    ]}
                  >
                    {productDetail?.product.averageRating}
                  </Text>
                  {[
                    ...Array(
                      Math.ceil(
                        (productDetail?.product.averageRating as number) || 0,
                      ),
                    ),
                  ].map((star, index) => {
                    const isHalf =
                      index + 1 >
                      (productDetail?.product.averageRating as number);
                    return (
                      <Fragment key={index}>
                        {!isHalf ? (
                          <Star
                            fill={
                              index <
                              (productDetail?.product.averageRating as number)
                                ? '#FFD700'
                                : '#C0C0C0'
                            }
                            size={30}
                          />
                        ) : (
                          <StarHalf fill='#FFD700' size={30} />
                        )}
                      </Fragment>
                    );
                  })}
                  <Text
                    style={[
                      textStyles.hintBoldItalic,
                      {
                        color: '#d0021c',
                      },
                    ]}
                  >
                    ({productDetail?.rating.reviews.length} đánh giá)
                  </Text>
                </View>
              </View>
            )}
            <View>
              {productDetail?.rating.starRate &&
              (productDetail.product.averageRating as number) > 0 ? (
                Object.keys(productDetail.rating.starRate)
                  .reverse()
                  .map((rating, index) => {
                    const starKeys = Object.keys(
                      productDetail.rating.starRate,
                    ) as Array<keyof typeof productDetail.rating.starRate>;

                    const averageRatingStar = ((
                      productDetail.rating.starRate[starKeys[index]] * 100
                    ).toString() + '%') as any;

                    return (
                      <View key={index} style={styles.listItem}>
                        <View style={viewStyles.flexRow}>
                          <Text className='text-black'>
                            {index + 1}
                            <Star color='#C54600' size={15} />
                          </Text>
                        </View>
                        <View style={styles.timelineStar}>
                          <View
                            style={[
                              styles.timing,
                              {
                                width: averageRatingStar,
                              },
                            ]}
                          />
                        </View>
                        <Text style={styles.numberPercent}>
                          {averageRatingStar}
                        </Text>
                      </View>
                    );
                  })
              ) : (
                <Text
                  style={[
                    textStyles.hintBoldItalic,
                    {
                      fontSize: 16,
                      fontWeight: 'normal',
                      marginTop: 10,
                    },
                  ]}
                >
                  Chưa có đánh giá
                </Text>
              )}
            </View>
            <View
              style={{
                margin: 4,
              }}
            >
              {productDetail?.rating.reviews.map((review, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      marginTop: 10,
                    }}
                  >
                    <Text style={textStyles.bold}>{review.user?.name}</Text>
                    <View style={viewStyles.flexRow}>
                      {[...Array(5)].map((star, index) => {
                        return (
                          <Star
                            key={index}
                            size={15}
                            fill={
                              index < (review.rating as number)
                                ? '#FFD700'
                                : '#C0C0C0'
                            }
                            className='mr-1 my-2'
                          />
                        );
                      })}
                    </View>
                    <Text style={textStyles.normal}>{review.comment}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.bottomBar}>
        <View style={styles.buttonQuantity}>
          <View>
            <TouchableOpacity
              onPress={() => setQuantity(quantity - 1)}
              disabled={quantity === 1}
              style={[
                buttonStyles.buttonIncrease,
                quantity === 1 ? { backgroundColor: '#ccc' } : {},
              ]}
            >
              <RemoveIcon size='xl' color='#fff' alignSelf='center' />
            </TouchableOpacity>
          </View>
          <Text
            style={{
              fontSize: 16,
              marginHorizontal: 15,
              alignSelf: 'center',
              justifyContent: 'center',
              color: '#000',
            }}
          >
            {quantity}
          </Text>
          <View>
            <TouchableOpacity
              onPress={() => setQuantity(quantity + 1)}
              disabled={quantity === product.inventory}
              style={[
                buttonStyles.buttonIncrease,
                quantity === product.inventory
                  ? { backgroundColor: '#ccc' }
                  : {},
              ]}
            >
              <AddIcon size='xl' color='#fff' alignSelf='center' />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={styles.buttonAddToCart}
          onPress={() => navigation.navigate('SearchScreen')}
        >
          <Text style={textStyles.bold}>Thêm vào giỏ hàng</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#BAE6FD',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    height: 70,
    alignItems: 'center',
  },
  search: {
    width: '100%',
    height: 70,
    paddingRight: 15,
  },
  image: {
    alignSelf: 'center',
  },
  content: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: '#000',
  },
  count: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    alignItems: 'center',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#C54600',
  },
  buttonQuantity: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    flex: 1,
    // alignItems: 'center',
    alignContent: 'center',
    // alignSelf: 'center',
  },
  scrollView: {
    flex: 1,
  },
  textButton: {
    color: '#DC2626',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#fff',
  },
  buttonAddToCart: {
    backgroundColor: 'pink',
    paddingLeft: 15,
    height: '100%',
    flex: 1,
    justifyContent: 'center',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 2,
    gap: 4,
  },
  timelineStar: {
    flex: 8,
    height: 10,
    backgroundColor: '#ccc',
  },
  timing: {
    height: '100%',
    backgroundColor: '#C54600',
  },
  numberPercent: {
    flex: 1,
    // textAlign: 'right',
    color: textStyles.normal.color,
  },
});

export default DetailProductScreen;
