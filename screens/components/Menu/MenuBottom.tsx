import React, { useEffect, useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProductScreen from '../../product/ProductScreen';
import CartScreen from '../../cart/CartScreen';
import ServiceScreen from '../../service/ServiceScreen';
import NotificationScreen from '../../notification/NotificationScreen';
import AccountScreen from '../../account/AccountScreen';
import { BackHandler, StyleSheet } from 'react-native';
import { useCustomerStore } from '../../../zustand/customerStore';
import UnverifyAccountScreen from '../../account/UnverifyAccountScreen';
import {
  Menu,
  PawPrint,
  Bell,
  UserRound,
  ShoppingBasket,
  Home,
} from 'lucide-react-native';
import HomeScreen from '../../product/HomeScreen';
import { socket } from '../../../socket';
import { Socket } from 'socket.io-client';

const MenuBottom = () => {
  const Tab = createBottomTabNavigator();
  const customerState = useCustomerStore((state) => state.customerState);
  const handleBackButton = () => {
    BackHandler.exitApp();
    return true;
  };

  const socketRef = useRef<Socket>();

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
        console.log('socketClient', socketData);
      }

      socketClient.on(accessToken, onTradeEvent);

      return () => {
        socketClient.off(accessToken, onTradeEvent);
      };
    }
  }, [customerState?.data?.accessToken]);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    };
  }, []);

  return (
    <Tab.Navigator initialRouteName='HomeScreen'>
      <Tab.Screen
        name='Trang chủ'
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Home color={focused ? '#000000' : '#ca8a04'} />
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
            <Menu color={focused ? '#000000' : '#ca8a04'} />
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
            <ShoppingBasket color={focused ? '#000000' : '#ca8a04'} />
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
            <PawPrint color={focused ? '#000000' : '#ca8a04'} />
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
            <Bell color={focused ? '#000000' : '#ca8a04'} />
          ),
          tabBarLabelStyle: styles.tabBarLabel,
        }}
      />
      <Tab.Screen
        name='Tài khoản'
        component={
          Object.keys(customerState.data).length == 0
            ? UnverifyAccountScreen
            : AccountScreen
        }
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <UserRound color={focused ? '#000000' : '#ca8a04'} />
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
    color: '#ca8a04',
  },
});

export default MenuBottom;
