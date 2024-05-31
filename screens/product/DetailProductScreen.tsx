import { AddIcon, ArrowLeftIcon, RemoveIcon, View } from '@gluestack-ui/themed';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
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
import {
  ChevronDownIcon,
  ChevronDownSquareIcon,
  ChevronUpIcon,
  ChevronsRightIcon,
  Star,
  StarHalf,
} from 'lucide-react-native';
import viewStyles from '../styles/ViewStyles';
import { Product, ProductDetail } from '../../interface/Product';
import { getActiveProducts, getProductDetailByCode } from '../../api/product';
import { vi } from 'date-fns/locale';
import ProductCard from '../components/Product/ProductCard';
import { v4 as uuidv4 } from 'uuid';
import { useCartStore } from '../../zustand/cartStore';

const ratings = [
  { stars: 5, width: '65%', percent: '65%' },
  { stars: 4, width: '11%', percent: '11%' },
  { stars: 3, width: '14%', percent: '14%' },
  { stars: 2, width: '9%', percent: '9%' },
  { stars: 1, width: '1%', percent: '1%' },
];

const DetailProductScreen = ({ navigation, route }: any) => {
  const { addToCart } = useCartStore();

  const [quantity, setQuantity] = useState(1);
  const { product } = route.params;
  const [productDetail, setProductDetail] = useState<ProductDetail | null>(
    null,
  );
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [tab, setTab] = useState(0);
  const [recommendProducts, setRecommendProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProductDetailByCode(product.purrPetCode).then((res) => {
      if (res.err === 0) {
        setProductDetail(res.data);
      }
    });
  }, []);

  useEffect(() => {
    const params = {
      limit: 10,
      page: 1,
      categoryCode: product.categoryCode,
    } as any;
    getActiveProducts(params).then((res) => {
      if (res.err === 0) {
        setRecommendProducts(res.data);
      }
    });
  }, [product]);

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
      <ScrollView style={styles.scrollView} key={uuidv4()}>
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
              <View style={viewStyles.flexColumn}>
                {product.discountQuantity > 0 && (
                  <Text style={styles.price}>
                    {formatCurrency(product.priceDiscount)}
                  </Text>
                )}
                <View style={viewStyles.flexRow}>
                  <Text
                    style={
                      product.discountQuantity
                        ? {
                            color: 'text-gray-500',
                            textDecorationLine: 'line-through',
                            fontSize: 17,
                          }
                        : styles.price
                    }
                  >
                    {formatCurrency(product.price)}{' '}
                  </Text>
                  {product.discountQuantity > 0 && (
                    <Text className=' text-white  bg-red-600 px-2 py-1 rounded-md'>
                      -{' '}
                      {((product.price - product.priceDiscount) /
                        product.price) *
                        100}
                      %
                    </Text>
                  )}
                </View>
              </View>
            </View>

            <Text style={{ marginTop: 10, color: '#000000' }}>
              Đã bán {productDetail?.product.orderQuantity}
            </Text>

            <View
              style={[
                viewStyles.flexRow,
                {
                  paddingTop: 10,
                },
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.tab,
                  {
                    backgroundColor: tab === 0 ? '#f0f0f0' : '#fff',
                    borderBottomWidth: tab === 0 ? 3 : 1,
                  },
                ]}
                onPress={() => setTab(0)}
              >
                <Text
                  style={{
                    fontSize: 18,
                    color: tab === 0 ? '#C54600' : '#000000',
                    fontWeight: 'bold',
                  }}
                >
                  Mô tả
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tab,
                  {
                    backgroundColor: tab === 1 ? '#f0f0f0' : '#fff',
                    borderBottomWidth: tab === 1 ? 3 : 1,
                  },
                ]}
                onPress={() => setTab(1)}
              >
                <Text
                  style={{
                    fontSize: 18,
                    color: tab === 1 ? '#C54600' : '#000000',
                    fontWeight: 'bold',
                  }}
                >
                  Đánh giá
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                marginTop: 10,
              }}
            >
              {tab === 0 ? (
                <View>
                  <View>
                    <Text
                      style={[
                        textStyles.normal,
                        {
                          textAlign: 'justify',
                        },
                      ]}
                      numberOfLines={descriptionExpanded ? undefined : 4}
                    >
                      {productDetail?.product.description}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={viewStyles.flexRow}
                    className='self-center mt-2'
                    onPress={() => setDescriptionExpanded(!descriptionExpanded)}
                  >
                    <Text className='mr-1 text-[#000000] text-sx'>
                      {descriptionExpanded ? 'Thu gọn' : 'Xem thêm'}
                    </Text>
                    {descriptionExpanded ? (
                      <ChevronUpIcon color='#000000' />
                    ) : (
                      <ChevronDownIcon color='#000000' />
                    )}
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  {(productDetail?.product.averageRating as number) > 0 && (
                    <View style={[styles.count, { marginTop: 0 }]}>
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
                              (productDetail?.product
                                .averageRating as number) || 0,
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
                                    (productDetail?.product
                                      .averageRating as number)
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
                          ) as Array<
                            keyof typeof productDetail.rating.starRate
                          >;

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
                        }) && (
                        <View
                          style={{
                            margin: 4,
                          }}
                        >
                          {productDetail?.rating.reviews.map(
                            (review, index) => {
                              return (
                                <View
                                  key={index}
                                  style={{
                                    marginTop: 10,
                                  }}
                                >
                                  <Text style={textStyles.bold}>
                                    {review.user?.name}
                                  </Text>
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
                                  <Text style={textStyles.normal}>
                                    {review.comment}
                                  </Text>
                                </View>
                              );
                            },
                          )}
                          <View
                            style={{
                              marginTop: 10,
                            }}
                          >
                            <TouchableOpacity
                              style={viewStyles.flexRow}
                              className='self-center mt-2'
                              onPress={() =>
                                navigation.navigate('ProductReviewScreen', {
                                  productCode: product.purrPetCode,
                                })
                              }
                            >
                              <Text className='mr-1 text-[#000000] text-sx'>
                                Xem tất cả
                              </Text>
                              <ChevronsRightIcon color='#000000' />
                            </TouchableOpacity>
                          </View>
                        </View>
                      )
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
                </View>
              )}
              <View
                style={{
                  marginTop: 20,
                }}
              >
                <Text style={styles.textButton}>Sản phẩm liên quan</Text>
                <ScrollView
                  key={uuidv4()}
                  horizontal
                  style={{
                    marginTop: 10,
                  }}
                >
                  {recommendProducts.map((product, index) => (
                    <ProductCard
                      product={product}
                      navigation={navigation}
                      productKey={uuidv4()}
                    />
                  ))}
                </ScrollView>
                <TouchableOpacity
                  style={viewStyles.flexRow}
                  className='self-center mt-2'
                  onPress={() => navigation.navigate('Sản phẩm')}
                >
                  <Text className='mr-1 text-[#000000] text-sx'>Xem thêm</Text>
                  <ChevronsRightIcon color='#000000' />
                </TouchableOpacity>
              </View>
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
              disabled={
                product.discountQuantity
                  ? quantity === product.discountQuantity
                  : quantity === product.inventory
              }
              style={
                product.discountQuantity
                  ? [
                      buttonStyles.buttonIncrease,
                      quantity === product.discountQuantity
                        ? { backgroundColor: '#ccc' }
                        : {},
                    ]
                  : [
                      buttonStyles.buttonIncrease,
                      quantity === product.inventory
                        ? { backgroundColor: '#ccc' }
                        : {},
                    ]
              }
            >
              <AddIcon size='xl' color='#fff' alignSelf='center' />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={styles.buttonAddToCart}
          onPress={() => {
            addToCart({
              productCode: productDetail?.product.purrPetCode,
              quantity,
            });
          }}
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
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderBottomColor: '#C54600',
  },
});

export default DetailProductScreen;
