import React, { useEffect, useRef, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProductScreen from '../../product/ProductScreen';
import CartScreen from '../../cart/CartScreen';
import ServiceScreen from '../../service/ServiceScreen';
import NotificationScreen from '../../notification/NotificationScreen';
import AccountScreen from '../../account/AccountScreen';
import { StyleSheet } from 'react-native';
import { useCustomerStore } from '../../../zustand/customerStore';
import UnverifyAccountScreen from '../../account/UnverifyAccountScreen';
import {
  Menu,
  PawPrint,
  Bell,
  UserRound,
  ShoppingBasket,
  Home,
  View,
  Circle,
} from 'lucide-react-native';
import HomeScreen from '../../product/HomeScreen';
import { socket } from '../../../socket';
import { Socket } from 'socket.io-client';
import { VStack } from '@gluestack-ui/themed';
import {
  Notification,
  NotificationRequestParams,
} from '../../../interface/Notification';
import { useNotificationStore } from '../../../zustand/notificationStore';

const MenuBottom = () => {
  const Tab = createBottomTabNavigator();
  const customerState = useCustomerStore((state) => state.customerState);
  const listNotificationState = useNotificationStore(
    (state) => state.listNotificationState,
  );
  const notificationRequestParams = {
    limit: 10,
    page: 1,
  } as NotificationRequestParams;

  const { getAllNotifications } = useNotificationStore();
  // const [notifications, setNotifications] = useState<Notification[]>([]);
  //number of noti not yet seen\
  const [notificationNotSeen, setNotificationNotSeen] = useState(0);

  const socketRef = useRef<Socket>();

  useEffect(() => {
    if (customerState.data.accessToken) {
      getAllNotifications(notificationRequestParams);
    }
  }, []);

  useEffect(() => {
    if (listNotificationState.data.length > 0) {
      const notiNotSeen = listNotificationState.data.filter(
        (noti: Notification) => noti.seen === false,
      );
      setNotificationNotSeen(notiNotSeen.length);
    }
  }, [listNotificationState.data]);

  useEffect(() => {
    if (
      Object.keys(customerState.data).length > 0 &&
      customerState.data.accessToken
    ) {
      // Socket
      const accessToken = customerState.data.accessToken;
      const socketClient = socket(accessToken);
      socketRef.current = socketClient;

      function onTradeEvent(value: any) {
        const socketData = JSON.parse(value);
        // console.log('socketClient', socketData);
        getAllNotifications(notificationRequestParams);
      }
      socketClient.on('connect', () => {
        console.log('socket connected');
      });

      socketClient.on(accessToken, onTradeEvent);

      return () => {
        socketClient.off(accessToken, onTradeEvent);
      };
    }
  }, [customerState?.data?.accessToken]);

  return (
    <Tab.Navigator initialRouteName='HomeScreen'>
      <Tab.Screen
        name='Trang chủ'
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Home color={focused ? '#000000' : '#265F77'} />
          ),
          tabBarLabelStyle: styles.tabBarLabel,
        }}
      />
      <Tab.Screen
        name='Sản phẩm'
        component={ProductScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Menu color={focused ? '#000000' : '#265F77'} />
          ),
          // headerRight: () => <SearchProduct navigation={'SearchScreen'} />,
          tabBarLabelStyle: styles.tabBarLabel,
        }}
      />
      <Tab.Screen
        name='Giỏ hàng'
        component={CartScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <ShoppingBasket color={focused ? '#000000' : '#265F77'} />
          ),
          tabBarLabelStyle: styles.tabBarLabel,
        }}
      />
      <Tab.Screen
        name='Dịch vụ'
        component={ServiceScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <PawPrint color={focused ? '#000000' : '#265F77'} />
          ),
          tabBarLabelStyle: styles.tabBarLabel,
        }}
      />
      <Tab.Screen
        name='Thông báo'
        component={NotificationScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            // <Bell color={focused ? '#000000' : '#265F77'} />
            <VStack>
              {notificationNotSeen > 0 && (
                <View
                  style={{
                    position: 'absolute',
                    zIndex: 2,
                    alignItems: 'flex-end',
                    left: 18,
                    bottom: 3,
                  }}
                >
                  <Circle size={10} fill={'red'} />
                </View>
              )}
              <Bell color={focused ? '#000000' : '#265F77'} />
            </VStack>
          ),
          tabBarLabelStyle: styles.tabBarLabel,
        }}
      />
      <Tab.Screen
        name='Tài khoản'
        component={
          Object.keys(customerState.data).length === 0
            ? UnverifyAccountScreen
            : AccountScreen
        }
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <UserRound color={focused ? '#000000' : '#265F77'} />
          ),
          tabBarLabelStyle: styles.tabBarLabel,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarLabel: {
    fontSize: 10,
    color: '#265F77',
  },
});

export default MenuBottom;
