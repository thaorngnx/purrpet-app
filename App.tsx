import 'react-native-gesture-handler';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config'; // Optional if you want to use default theme
import Realm from 'realm';
import TokenSchema from './realmModel/TokenSchema';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import 'core-js/stable/atob';
import { useCustomerStore } from './zustand/customerStore';
import SearchScreen from './screens/product/SearchScreen';
import SearchProduct from './screens/components/Search/SearchProduct';
import SpaScreen from './screens/service/SpaScreen';
import HomeSrceen from './screens/service/HomeScreen';
import DetailProductScreen from './screens/product/DetailProductScreen';
import VerifyUserEmailScreen from './screens/verifyUser/VerifyUserEmailScreen';
import VerifyUserOTPScreen from './screens/verifyUser/VerifyUserOTPScreen';
import MenuBottom from './screens/components/Menu/MenuBottom';
import { Appearance, StatusBar } from 'react-native';
import AccountInfoScreen from './screens/account/AccountInfoScreen';
import HistoryScreen from './screens/account/HistoryScreen';
import OrderHistoryScreen from './screens/account/history/OrderHistoryScreen';
import SpaHistoryScreen from './screens/account/history/SpaHistoryScreen';
import HomestayHistoryScreen from './screens/account/history/HomestayHistoryScreen';
import OrderDetailScreen from './screens/account/history/detail/OrderDetailScreen';
import BookingSpaDetailScreen from './screens/account/history/detail/BookingSpaDetailScreen';
import BookingHomeDetailScreen from './screens/account/history/detail/BookingHomeDetailScreen';
import BookingHomeScreen from './screens/service/bookingHome/BookingHomeScreen';
import BookingSpaScreen from './screens/service/bookingSpa/BookingSpaScreen';
import WellcomeSrceen from './screens/components/Wellcome/WellcomeScreen';
import { useCartStore } from './zustand/cartStore';
import ProcessingOrderSceen from './screens/cart/ProcessingOrderSceen';
import ProcessingBookingSpa from './screens/service/bookingSpa/ProcessingBookingSpa';
import ProcessingBookingHome from './screens/service/bookingHome/ProcessingBookingHome';
import OrderReviewScreen from './screens/account/history/review/OrderReviewScreen';
import { useCategoryStore } from './zustand/categoryStore';
import { useNotificationStore } from './zustand/notificationStore';
import { socket } from './socket';
import { Socket } from 'socket.io-client';
import FinancialStatistics from './screens/account/FinancialStatistics';
import ProductReviewScreen from './screens/product/ProductReviewScreen';
import { LogBox } from 'react-native';
import { CoinWalletScreen } from './screens/account/CoinWalletScreen';
import FavoriteProductScreen from './screens/account/FavoriteProductScreen';

const Stack = createNativeStackNavigator();
export default function App() {
  const { getCustomerById } = useCustomerStore();
  const { getCart } = useCartStore();
  const { getActiveCategories } = useCategoryStore();
  const { getAllNotifications } = useNotificationStore();
  const [isDarkMode, setIsDarkMode] = useState(
    Appearance.getColorScheme() === 'dark',
  );
  //get customer from realm
  const realm = new Realm({ schema: [TokenSchema] });
  const token = realm.objects('Token') as any;
  let accessToken = '';
  if (token.length > 0) {
    // console.log('token:', token[0].accessToken);
    // console.log('token App:', token);
    accessToken = token[0]?.accessToken;
    // console.log('accessToken App:', accessToken);
  }

  // useEffect(() => {
  //   if (customer) {
  //     getAllNotifications();
  //   }
  // }, [customer]);

  LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
  LogBox.ignoreAllLogs(); //Ignore all log notifications

  useEffect(() => {
    //get cart from server
    getCart();
    getActiveCategories();
    //block dark mode
    StatusBar.setBackgroundColor('white');
    StatusBar.setBarStyle('dark-content');
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setIsDarkMode(colorScheme === 'dark');
    });

    return () => subscription.remove();
  }, []);
  //get customer info from server
  useEffect(() => {
    if (accessToken) {
      // console.log('accessToken:', accessToken);
      const decoded = jwtDecode(accessToken) as any;
      //get customer info from server
      getCustomerById(decoded.id);
    }
  }, [accessToken]);

  return (
    <GluestackUIProvider config={config}>
      <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name='WelcomeScreen'
            component={WellcomeSrceen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name='MenuBottom'
            component={MenuBottom}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name='VerifyUserEmailScreen'
            component={VerifyUserEmailScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='VerifyUserOTPScreen'
            component={VerifyUserOTPScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='AccountInfoScreen'
            component={AccountInfoScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='HistoryScreen'
            component={HistoryScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='OrderHistoryScreen'
            component={OrderHistoryScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name='SpaHistoryScreen'
            component={SpaHistoryScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='HomestayHistoryScreen'
            component={HomestayHistoryScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='OrderDetailScreen'
            component={OrderDetailScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name='BookingSpaDetailScreen'
            component={BookingSpaDetailScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name='BookingHomeDetailScreen'
            component={BookingHomeDetailScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name='DetailProductScreen'
            component={DetailProductScreen}
            options={{
              headerShown: false,
              headerRight: () => <SearchProduct navigation={'SearchScreen'} />,
            }}
          />
          <Stack.Screen
            name='SearchScreen'
            component={SearchScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='SpaScreen'
            component={SpaScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='HomeScreen'
            component={HomeSrceen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='BookingHomeScreen'
            component={BookingHomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='BookingSpaScreen'
            component={BookingSpaScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='ProcessingOrderSceen'
            component={ProcessingOrderSceen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='ProcessingBookingSpa'
            component={ProcessingBookingSpa}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='ProcessingBookingHome'
            component={ProcessingBookingHome}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='OrderReviewScreen'
            component={OrderReviewScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='FinancialStatistics'
            component={FinancialStatistics}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='ProductReviewScreen'
            component={ProductReviewScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='CoinWalletScreen'
            component={CoinWalletScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='FavoriteProductScreen'
            component={FavoriteProductScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GluestackUIProvider>
  );
}
