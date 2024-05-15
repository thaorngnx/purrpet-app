import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import viewStyles from '../../../styles/ViewStyles';
import {
  ArrowLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  Heading,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  Button,
  ButtonText,
  Modal,
  ModalContent,
  ModalHeader,
  Icon,
  ModalFooter,
  Spinner,
  Toast,
  useToast,
  VStack,
  ToastTitle,
  ToastDescription,
} from '@gluestack-ui/themed';
import textStyles from '../../../styles/TextStyles';
import { formatCurrency, formatDateTime } from '../../../../utils/formatData';
import { Order } from '../../../../interface/Order';
import { Fragment, useEffect, useState } from 'react';
import { getOrderByCode } from '../../../../api/order';
import { getProductByCode, getProducts } from '../../../../api/product';
// import { ChevronRightIcon } from 'lucide-react-native';
import buttonStyles from '../../../styles/ButtonStyles';
import { TextInput } from 'react-native';
import { Star } from 'lucide-react-native';
import textInputStyles from '../../../styles/TextInputStyles';
import {
  createReview,
  getReivewByCodeAndCustomer,
} from '../../../../api/review';
import { Review } from '../../../../interface/Product';

interface ProductOrder {
  productCode: string;
  images: { path: string }[];
  name: string;
  quantity: number;
  price: number;
  totalPrice: number;
  review?: Review;
  reviewed?: boolean;
}

interface OrderDetail {
  order: Order;
  productOrders: ProductOrder[];
}

const OrderReviewScreen = ({ navigation, route }: any) => {
  const totalStars = 5;
  const toast = useToast();
  const { order } = route.params as { order: Order };
  const [orderDetail, setOrderDetail] = useState<OrderDetail>({
    order: order,
    productOrders: [],
  } as OrderDetail);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductOrder>(
    null as any,
  );
  const [review, setReview] = useState<Review>({} as Review);
  const [isReviewed, setIsReviewed] = useState(false);

  const fetchOrderDetail = async () => {
    getOrderByCode(order.purrPetCode).then(async (res) => {
      if (res.err === 0) {
        const order = res.data;
        const orderItems = res.data.orderItems;
        const productCodes: string[] = [];
        res.data.orderItems.forEach((item: any) => {
          productCodes.push(item.productCode);
        });
        const productsRes = await getProducts({
          productCodes: productCodes.toString(),
        });
        if (productsRes.err === 0) {
          let productOrder: ProductOrder[] = [];
          for (const item of productsRes.data) {
            for (const orderItem of orderItems) {
              if (item.purrPetCode === orderItem.productCode) {
                const reviewRes = await getReivewByCodeAndCustomer(
                  order.purrPetCode,
                  orderItem.productCode,
                );
                if (reviewRes.err === 0) {
                  let reviewed = false;
                  if (reviewRes.data.rating > 0) {
                    reviewed = true;
                  }
                  let product = {
                    productCode: orderItem.productCode,
                    images: item.images,
                    name: item.productName,
                    quantity: orderItem.quantity,
                    price: orderItem.productPrice,
                    totalPrice: orderItem.totalPrice,
                    review: reviewRes.data,
                    reviewed: reviewed,
                  };
                  productOrder.push(product);
                }
              }
            }
          }
          setOrderDetail({
            order: order,
            productOrders: productOrder,
          });
        }
      }
    });
  };
  useEffect(() => {
    fetchOrderDetail();
  }, []);

  useEffect(() => {
    fetchOrderDetail();
    setIsReviewed(false);
  }, [isReviewed]);

  useEffect(() => {
    if (orderDetail.order && orderDetail.productOrders.length > 0) {
      setLoading(false);
    }
  }, [orderDetail]);

  const handleOpenModal = (product: ProductOrder) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    selectedProduct && setSelectedProduct(null as any);
    setShowModal(false);
    setReview({} as Review);
  };

  const handleRating = () => {
    review.productCode = selectedProduct.productCode;
    review.orderCode = order.purrPetCode;
    createReview(review).then((res: any) => {
      if (res.err === 0) {
        setIsReviewed(true);
        setReview({} as Review);
      } else {
        console.log(res.message);
      }
    });
    setShowModal(false);
  };

  return (
    <SafeAreaView style={viewStyles.container}>
      <View style={viewStyles.titlePageBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeftIcon />
        </TouchableOpacity>
        <Text style={textStyles.title}>
          Đánh giá đơn hàng {order.purrPetCode}
        </Text>
      </View>
      {loading ? (
        <View style={viewStyles.centerContainer}>
          <Spinner size='large' />
        </View>
      ) : (
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={viewStyles.scrollContainer}
          >
            {orderDetail.productOrders.map((productOrder, index) => {
              return (
                <View style={viewStyles.boxUnderline} key={index}>
                  <View style={viewStyles.flexRow}>
                    <Image
                      source={{ uri: productOrder.images[0]?.path }}
                      style={viewStyles.historyImage}
                    />
                    <View style={viewStyles.flexColumn} className='w-[76%]'>
                      <Text
                        numberOfLines={1}
                        style={textStyles.normal}
                        className='truncate'
                      >
                        {productOrder.name}
                      </Text>
                      <View
                        style={viewStyles.flexRow}
                        className='justify-between'
                      >
                        <Text style={textStyles.normal}>
                          {formatCurrency(productOrder.price)}
                        </Text>
                        <Text style={textStyles.normal}>
                          x{productOrder.quantity}
                        </Text>
                      </View>
                      <View style={viewStyles.flexRow} className='justify-end'>
                        <Text style={textStyles.normal}>
                          {formatCurrency(productOrder.totalPrice)}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={viewStyles.flexRow} className='justify-end mt-2'>
                    <TouchableOpacity
                      style={viewStyles.flexRow}
                      onPress={() =>
                        navigation.navigate('DetailProductScreen', {
                          product: {
                            purrPetCode: productOrder.productCode,
                            ...productOrder,
                          },
                        })
                      }
                    >
                      <Text className='mr-1 text-[#60A5FA]'>Xem chi tiết</Text>
                      <ChevronRightIcon color='#60A5FA' />
                    </TouchableOpacity>
                  </View>

                  <View style={viewStyles.flexRow} className='justify-center'>
                    <TouchableOpacity
                      style={buttonStyles.buttonOutline}
                      onPress={() => handleOpenModal(productOrder)}
                    >
                      <Text
                        style={[
                          textStyles.bold,
                          {
                            color: '#60A5FA',
                            marginHorizontal: 10,
                          },
                        ]}
                      >
                        {!productOrder.reviewed ? 'Đánh giá' : 'Đã đánh giá'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </ScrollView>
          {selectedProduct && (
            <Modal isOpen={showModal} onClose={() => handleCloseModal()}>
              <ModalBackdrop />
              <ModalContent
                style={{
                  width: '95%',
                  height: 'auto',
                  maxHeight: '80%',
                }}
              >
                <ModalHeader>
                  <Heading size='md'>Đánh giá sản phẩm</Heading>
                  <ModalCloseButton>
                    <Icon as={CloseIcon} />
                  </ModalCloseButton>
                </ModalHeader>
                <ModalBody>
                  <View
                    style={{
                      paddingTop: 10,
                    }}
                    key={selectedProduct.productCode}
                  >
                    <View style={[viewStyles.flexRow, { flex: 1 }]}>
                      <Image
                        source={{ uri: selectedProduct.images[0].path }}
                        style={[viewStyles.historyImage, { flex: 1 }]}
                      />
                      <Text style={[textStyles.normal, { flex: 3 }]}>
                        {selectedProduct.name}
                      </Text>
                    </View>
                    <View>
                      <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: 'bold',
                            color: 'black',
                          }}
                        >
                          Đánh giá sao
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        {[...Array(totalStars)].map((star, index) => {
                          return (
                            <TouchableOpacity
                              key={index}
                              disabled={selectedProduct.reviewed ? true : false}
                              onPress={() =>
                                setReview((prevReview) => ({
                                  ...prevReview,
                                  rating: index + 1,
                                }))
                              }
                            >
                              <Star
                                size={40}
                                fill={
                                  index <
                                  (selectedProduct.reviewed
                                    ? (selectedProduct.review?.rating as number)
                                    : (review?.rating as number))
                                    ? '#FFD700'
                                    : '#C0C0C0'
                                }
                              />
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                      <View style={{ marginTop: 10 }}>
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: 'bold',
                            color: 'black',
                          }}
                        >
                          Bình luận
                        </Text>
                        <TextInput
                          style={textInputStyles.textInputBorder}
                          multiline
                          numberOfLines={4}
                          placeholder='Nhập bình luận của bạn'
                          placeholderTextColor={'#A0A0A0'}
                          editable={selectedProduct.reviewed ? false : true}
                          onChangeText={(text) =>
                            setReview((prevReview) => ({
                              ...prevReview,
                              comment: text,
                            }))
                          }
                          defaultValue={
                            selectedProduct.reviewed
                              ? selectedProduct.review?.comment
                              : ''
                          }
                        />
                      </View>
                    </View>
                  </View>
                </ModalBody>
                <ModalFooter>
                  {!selectedProduct.reviewed && (
                    <Fragment>
                      <Button
                        variant='outline'
                        size='sm'
                        action='secondary'
                        mr='$3'
                        onPress={() => {
                          handleCloseModal();
                        }}
                      >
                        <ButtonText>Hủy</ButtonText>
                      </Button>
                      <Button
                        size='sm'
                        action='positive'
                        borderWidth='$0'
                        onPress={() => handleRating()}
                      >
                        <ButtonText>Gửi đánh giá</ButtonText>
                      </Button>
                    </Fragment>
                  )}
                </ModalFooter>
              </ModalContent>
            </Modal>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

export default OrderReviewScreen;
