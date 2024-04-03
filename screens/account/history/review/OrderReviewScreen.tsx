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
import { useEffect, useState } from 'react';
import { getOrderByCode } from '../../../../api/order';
import { getProducts } from '../../../../api/product';
// import { ChevronRightIcon } from 'lucide-react-native';
import buttonStyles from '../../../styles/ButtonStyles';
import { TextInput } from 'react-native';
import { Star } from 'lucide-react-native';
import textInputStyles from '../../../styles/TextInputStyles';
import { createReview } from '../../../../api/review';
import { useCustomerStore } from '../../../../zustand/customerStore';
import { Review } from '../../../../interface/Product';

interface ProductOrder {
  productCode: string;
  images: { path: string }[];
  name: string;
  quantity: number;
  price: number;
  totalPrice: number;
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
  const customerId = useCustomerStore((state) => state.customerState.data);

  useEffect(() => {
    getOrderByCode(order.purrPetCode).then((res) => {
      if (res.err === 0) {
        const order = res.data;
        const orderItems = res.data.orderItems;
        const productCodes: string[] = [];
        res.data.orderItems.forEach((item: any) => {
          productCodes.push(item.productCode);
        });
        getProducts({ productCodes: productCodes.toString() }).then((res) => {
          if (res.err === 0) {
            let productOrder: ProductOrder[] = [];
            res.data.forEach((item: any) => {
              orderItems.forEach((orderItem: any) => {
                if (item.purrPetCode === orderItem.productCode) {
                  let product = {
                    productCode: orderItem.productCode,
                    images: item.images,
                    name: item.productName,
                    quantity: orderItem.quantity,
                    price: orderItem.productPrice,
                    totalPrice: orderItem.totalPrice,
                    star: null as any,
                  };
                  productOrder.push(product);
                }
              });
            });
            setOrderDetail({
              order: order,
              productOrders: productOrder,
            });
          }
        });
      }
    });
  }, []);

  useEffect(() => {
    if (orderDetail.order && orderDetail.productOrders.length > 0) {
      setLoading(false);
    }
  }, [orderDetail]);

  const handleOpenModal = (product: ProductOrder) => {
    console.log('handleRating');
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    selectedProduct && setSelectedProduct(null as any);
    setShowModal(false);
  };

  const handleRating = () => {
    review.productCode = selectedProduct.productCode;
    review.orderCode = order.purrPetCode;
    createReview(review).then((res: any) => {
      if (res.err === 0) {
        console.log('Review success');
      } else {
        console.log(res.message);
      }
    });
    setShowModal(false);
  };

  useEffect(() => {
    console.log(review);
  }, [review]);

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
            {orderDetail.productOrders.map((productOrder, index) => (
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
                        product: productOrder,
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
                      Đánh giá
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
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
                                  index < ((review?.rating as number) || 0)
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
                          onChangeText={(text) =>
                            setReview((prevReview) => ({
                              ...prevReview,
                              comment: text,
                            }))
                          }
                        />
                      </View>
                    </View>
                  </View>
                </ModalBody>
                <ModalFooter>
                  <Button
                    variant='outline'
                    size='sm'
                    action='secondary'
                    mr='$3'
                    onPress={() => {
                      setShowModal(false);
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