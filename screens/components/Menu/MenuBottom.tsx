import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProductScreen from '../../product/ProductScreen';
import CartScreen from '../../cart/CartScreen';
import ServiceScreen from '../../service/ServiceScreen';
import NotificationScreen from '../../notification/NotificationScreen';
import AccountScreen from '../../account/AccountSrceen';
import { BellIcon, MenuIcon } from '@gluestack-ui/themed';
import { Image } from 'react-native';
import SearchProduct from '../Search/SearchProduct';

const MenuBottom = () => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator initialRouteName='ProductScreen'>
      <Tab.Screen
        name='Sản phẩm'
        component={ProductScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Image source={require('../../../assets/iconProduct.png')} />
          ),
          headerRight: () => <SearchProduct navigation={'SearchScreen'} />,
        }}
      />
      <Tab.Screen
        name='Giỏ hàng'
        component={CartScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Image source={require('../../../assets/iconCart.png')} />
          ),
        }}
      />
      <Tab.Screen
        name='Dịch vụ'
        component={ServiceScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Image source={require('../../../assets/iconPets.png')} />
          ),
        }}
      />
      <Tab.Screen
        name='Thông báo'
        component={NotificationScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Image source={require('../../../assets/iconBell.png')} />
          ),
        }}
      />
      <Tab.Screen
        name='Tài khoản'
        component={AccountScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Image source={require('../../../assets/iconAccount.png')} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MenuBottom;
