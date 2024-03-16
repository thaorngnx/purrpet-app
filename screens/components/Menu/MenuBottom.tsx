import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProductScreen from '../../product/ProductScreen';
import CartScreen from '../../cart/CartScreen';
import ServiceScreen from '../../service/ServiceScreen';
import NotificationScreen from '../../notification/NotificationScreen';
import AccountScreen from '../../account/AccountScreen';
import { StyleSheet } from 'react-native';
import SearchProduct from '../Search/SearchProduct';
import { useCustomerStore } from '../../../zustand/customerStore';
import UnverifyAccountScreen from '../../account/UnverifyAccountScreen';
import {
  Menu,
  PawPrint,
  Bell,
  UserRound,
  ShoppingBasket,
} from 'lucide-react-native';
import HomeScreen from '../../product/HomeScreen';

const MenuBottom = () => {
  const Tab = createBottomTabNavigator();
  const customerState = useCustomerStore((state) => state.customerState);

  return (
    <Tab.Navigator initialRouteName='HomeScreen'>
      <Tab.Screen
        name='Trang chủ'
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Menu color='#ca8a04' />,
          // headerRight: () => <SearchProduct navigation={'SearchScreen'} />,
          tabBarLabelStyle: styles.tabBarLabel,
        }}
      />
      <Tab.Screen
        name='Sản phẩm'
        component={ProductScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Menu color='#ca8a04' />,
          // headerRight: () => <SearchProduct navigation={'SearchScreen'} />,
          tabBarLabelStyle: styles.tabBarLabel,
        }}
      />
      <Tab.Screen
        name='Giỏ hàng'
        component={CartScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => <ShoppingBasket color='#ca8a04' />,
          tabBarLabelStyle: styles.tabBarLabel,
        }}
      />
      <Tab.Screen
        name='Dịch vụ'
        component={ServiceScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => <PawPrint color='#ca8a04' />,
          tabBarLabelStyle: styles.tabBarLabel,
        }}
      />
      <Tab.Screen
        name='Thông báo'
        component={NotificationScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Bell color='#ca8a04' />,
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
          tabBarIcon: ({ color, size }) => <UserRound color='#ca8a04' />,
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
