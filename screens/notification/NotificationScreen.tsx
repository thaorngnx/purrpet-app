import { useCallback, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import textStyles from '../styles/TextStyles';
import { Link, LinkText, get } from '@gluestack-ui/themed';
import { useNotificationStore } from '../../zustand/notificationStore';
import viewStyles from '../styles/ViewStyles';
import { Circle } from 'lucide-react-native';
// import { Socket } from 'socket.io-client';
import { useCustomerStore } from '../../zustand/customerStore';
import { Notification } from '../../interface/notification';
import { NOTIFICATION_TYPE } from '../constants';
import { useFocusEffect } from '@react-navigation/native';

const NotificationScreen = ({ navigation }: any) => {
  const customer = useCustomerStore((state) => state.customerState.data);
  const notification = useNotificationStore(
    (state) => state.notificationState.data,
  );

  const { getAllNotifications } = useNotificationStore();

  useEffect(() => {}, []);

  useFocusEffect(
    useCallback(() => {
      if (customer.accessToken) {
        getAllNotifications();
      }
      return () => {
        // cleanup
      };
    }, []),
  );

  // useEffect(() => {
  //   if (customer.accessToken && socket) {
  //     getAllNotifications();

  //     socket.on(customer.accessToken, getAllNotifications());

  //     return () => {
  //       socket.off(customer.accessToken, getAllNotifications());
  //     };
  //   }
  // }, [customer.accessToken, socket]);
  // getAllNotifications();

  const handleViewNotification = (notification: Notification) => {
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
      {Object.keys(customer).length > 0 && notification?.length > 0 ? (
        <View>
          {notification.map((item: any, index: number) => (
            <TouchableOpacity
              onPress={() => handleViewNotification(item)}
              key={index}
              style={viewStyles.boxUnderline}
            >
              <View style={viewStyles.flexRow} className='items-center'>
                {!item.seen && (
                  <Circle size={10} fill={'red'} className='mr-2' />
                )}
                <Text style={textStyles.label}>{item.title}</Text>
              </View>
              <Text style={textStyles.normal}>{item.message}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
          {!Object.keys(customer).length > 0 && (
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
