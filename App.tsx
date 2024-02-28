import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config'; // Optional if you want to use default theme
import Realm from 'realm';
import TokenSchema from './realmModel/TokenSchema';

import ProductScreen from './screens/product/ProductScreen';
import DetailProductScreen from './screens/product/DetailProductScreen';
import VerifyUserEmailScreen from './screens/verifyUser/VerifyUserEmailScreen';
import VerifyUserOTPScreen from './screens/verifyUser/VerifyUserOTPScreen';
import MenuBottom from './screens/components/Menu/MenuBottom';
import { Text } from 'react-native';
import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import 'core-js/stable/atob';
import { useCustomerStore } from './zustand/customerStore';

const Stack = createNativeStackNavigator();
export default function App() {
  const { getCustomerById } = useCustomerStore();
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
  //get customer info from server
  useEffect(() => {
    if (accessToken) {
      const decoded = jwtDecode(accessToken) as any;
      //get customer info from server
      getCustomerById(decoded.id);
    }
  }, [accessToken]);

  return (
    <GluestackUIProvider config={config}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name='MenuBottom'
            component={MenuBottom}
            options={{ headerShown: false }}
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
            name='Chi tiết sản phẩm'
            component={DetailProductScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GluestackUIProvider>
  );
}
