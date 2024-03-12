import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProductScreen from '../../product/ProductScreen';
import CartScreen from '../../cart/CartScreen';
import ServiceScreen from '../../service/ServiceScreen';
import NotificationScreen from '../../notification/NotificationScreen';
import AccountScreen from '../../account/AccountScreen';
import { Image } from 'react-native';
import SearchProduct from '../Search/SearchProduct';
import { useCustomerStore } from '../../../zustand/customerStore';
import UnverifyAccountScreen from '../../account/UnverifyAccountScreen';
import {
  Menu,
  ShoppingCart,
  PawPrint,
  Bell,
  UserRound,
} from 'lucide-react-native';

const MenuBottom = () => {
  const Tab = createBottomTabNavigator();
  const customerState = useCustomerStore((state) => state.customerState);

  return (
    <Tab.Navigator initialRouteName='ProductScreen'>
      <Tab.Screen
        name='Sản phẩm'
        component={ProductScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Menu color='#ca8a04' />,
          headerRight: () => <SearchProduct navigation={'SearchScreen'} />,
        }}
      />
      <Tab.Screen
        name='Giỏ hàng'
        component={CartScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => <ShoppingCart color='#ca8a04' />,
        }}
      />
      <Tab.Screen
        name='Dịch vụ'
        component={ServiceScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => <PawPrint color='#ca8a04' />,
        }}
      />
      <Tab.Screen
        name='Thông báo'
        component={NotificationScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Bell color='#ca8a04' />,
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
          tabBarIcon: ({ color, size }) => <UserRound color='#ca8a04' />,
        }}
      />
    </Tab.Navigator>
  );
};

export default MenuBottom;
