import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import textStyles from '../styles/TextStyles';
import { Link, LinkText } from '@gluestack-ui/themed';
import { useNotificationStore } from '../../zustand/notificationStore';
import viewStyles from '../styles/ViewStyles';
import { CheckCheck, Circle } from 'lucide-react-native';
import { useCustomerStore } from '../../zustand/customerStore';
import {
  Notification,
  NotificationRequestParams,
} from '../../interface/Notification';
import { NOTIFICATION_TYPE } from '../constants';
import { useFocusEffect } from '@react-navigation/native';
import { formatTimeToNow } from '../../utils/formatData';
import { viewNotification } from '../../api/notification';
import { Pagination } from '../../interface/Pagination';

const NotificationScreen = ({ navigation }: any) => {
  const customer = useCustomerStore((state) => state.customerState.data);
  const listNotificationState = useNotificationStore(
    (state) => state.listNotificationState,
  );

  const { getAllNotifications, markAllAsRead } = useNotificationStore();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [pagination, setPagination] = useState({
    limit: 10,
    page: 1,
    total: 1,
  } as Pagination);
  const [loading, setLoading] = useState(false);
  const [stopLoadMore, setStopLoadMore] = useState(true);
  // const flatListRef = useRef<FlatList<Order> | null>(null);

  useEffect(() => {
    const params = {
      limit: pagination.limit,
      page: 1,
    } as NotificationRequestParams;
    getAllNotifications(params);
  }, []);

  useEffect(() => {
    if (listNotificationState.pagination.page > 1) {
      setNotifications(notifications.concat(listNotificationState.data));
      setLoading(false);
      setPagination(listNotificationState.pagination);
    } else {
      setNotifications(listNotificationState.data);
      setPagination(listNotificationState.pagination);
    }
  }, [listNotificationState]);

  useFocusEffect(
    useCallback(() => {
      if (customer.accessToken) {
        const params = {
          limit: pagination.limit,
          page: 1,
        } as NotificationRequestParams;
        console.log('params:', params);
        getAllNotifications(params);
      }
      return () => {
        // cleanup
      };
    }, []),
  );

  const handleLoadMore = () => {
    console.log('handleLoadMore');
    if (!stopLoadMore) {
      setLoading(true);
      setStopLoadMore(true);
      const params = {
        limit: pagination.limit,
        page: pagination.page + 1,
      } as NotificationRequestParams;

      console.log('params:', params);
      getAllNotifications(params);
    }
  };

  const handleViewNotification = (notification: Notification) => {
    viewNotification(notification._id);
    if (notification.type === NOTIFICATION_TYPE.ORDER) {
      navigation.navigate('OrderDetailScreen', {
        orderCode: notification.orderCode,
      });
    } else if (notification.type === NOTIFICATION_TYPE.BOOKING_SPA) {
      navigation.navigate('BookingSpaDetailScreen', {
        bookingSpaCode: notification.orderCode,
      });
    } else if (notification.type === NOTIFICATION_TYPE.BOOKING_HOME) {
      navigation.navigate('BookingHomeDetailScreen', {
        bookingHomeCode: notification.orderCode,
      });
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: '#ffff', height: '100%' }}>
      <View style={viewStyles.titlePageBar}>
        <Text style={textStyles.title}>Thông báo</Text>
      </View>

      {Object.keys(customer).length > 0 && notifications?.length > 0 ? (
        <>
          <TouchableOpacity
            style={[
              viewStyles.flexRow,
              {
                paddingHorizontal: 10,
                paddingBottom: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#f5f5f5',
                justifyContent: 'flex-end',
                alignItems: 'center',
              },
            ]}
            onPress={() => {
              markAllAsRead();
            }}
          >
            <CheckCheck color={'blue'} />
            <Text
              style={[
                textStyles.hint,
                {
                  color: 'blue',
                  marginLeft: 5,
                },
              ]}
            >
              Đánh dấu tất cả đã đọc
            </Text>
          </TouchableOpacity>
          <FlatList
            data={notifications}
            // keyExtractor={(item) => item.purrPetCode}
            // ref={flatListRef}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleViewNotification(item)}
                key={item._id}
                style={[
                  viewStyles.boxUnderline,
                  {
                    backgroundColor: item.seen ? '#ffff' : '#f5f5f5',
                  },
                ]}
              >
                <View style={[viewStyles.flexRow]} className='items-center'>
                  {!item.seen && (
                    <Circle size={10} fill={'red'} className='mr-2' />
                  )}
                  <Text style={textStyles.label}>{item.title}</Text>
                </View>
                <Text style={textStyles.normal}>{item.message}</Text>
                <Text
                  style={[
                    textStyles.hint,
                    {
                      textAlign: 'right',
                    },
                  ]}
                >
                  {formatTimeToNow(item.createdAt)}
                </Text>
              </TouchableOpacity>
            )}
            onEndReachedThreshold={0.1}
            onEndReached={() => {
              console.log('onEndReached');
              if (pagination.page < pagination.total) {
                handleLoadMore();
              }
            }}
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
        </>
      ) : (
        <View style={{ margin: 30 }}>
          <Image
            source={require('../../assets/image7.png')}
            style={{ alignSelf: 'center' }}
          />
          <Text style={textStyles.label}>Bạn chưa có thông báo nào!!</Text>
          <Text style={textStyles.label}>
            Hãy xác minh tài khoản để nhận thông báo!
          </Text>
          {Object.keys(customer).length === 0 && (
            <Link onPress={() => navigation.navigate('Tài khoản')}>
              <LinkText style={{ alignSelf: 'center' }}>Tài khoản</LinkText>
            </Link>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  header: {
    backgroundColor: '#BAE6FD',
    height: 70,
  },
});
export default NotificationScreen;
