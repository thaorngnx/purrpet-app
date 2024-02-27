import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config'; // Optional if you want to use default theme
//import VerifyUserEmailScreen from './screens/verifyUser/VerifyUserEmailScreen';
import ProductScreen from './screens/product/ProductScreen';
import DetailProductScreen from './screens/product/DetailProductScreen';
import VerifyUserEmailScreen from './screens/verifyUser/VerifyUserEmailScreen';
import VerifyUserOTPScreen from './screens/verifyUser/VerifyUserOTPScreen';

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <GluestackUIProvider config={config}>
      <NavigationContainer>
      <Stack.Navigator initialRouteName="ProductScreen">
        <Stack.Screen name="VerifyUserEmailScreen" component={VerifyUserEmailScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="VerifyUserOTPScreen" component={VerifyUserOTPScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="ProductScreen" component={ProductScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="DetailProductScreen" component={DetailProductScreen} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>

    </GluestackUIProvider>
  );
}