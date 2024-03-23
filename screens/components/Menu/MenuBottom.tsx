import React, { useEffect } from 'react';
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
import { Badge, VStack } from '@gluestack-ui/themed';
import { BadgeText } from '@gluestack-ui/themed';
import { BadgeIcon } from '@gluestack-ui/themed';

const MenuBottom = () => {
  const Tab = createBottomTabNavigator();
  const customerState = useCustomerStore((state) => state.customerState);
  const handleBackButton = () => {
    BackHandler.exitApp();
    return true;
  };

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
