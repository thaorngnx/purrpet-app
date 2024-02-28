import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config'; // Optional if you want to use default theme
import ProductScreen from './screens/product/ProductScreen';
import DetailProductScreen from './screens/product/DetailProductScreen';
import VerifyUserEmailScreen from './screens/verifyUser/VerifyUserEmailScreen';
import VerifyUserOTPScreen from './screens/verifyUser/VerifyUserOTPScreen';
import MenuBottom from './screens/components/Menu/MenuBottom';
import { Text } from 'react-native';

const Stack = createNativeStackNavigator();
export default function App() {
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
