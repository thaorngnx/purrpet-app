import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config'; // Optional if you want to use default theme
import DetailProductScreen from './screens/product/DetailProductScreen';
import VerifyUserEmailScreen from './screens/verifyUser/VerifyUserEmailScreen';
import VerifyUserOTPScreen from './screens/verifyUser/VerifyUserOTPScreen';
import MenuBottom from './screens/components/Menu/MenuBottom';
import SearchScreen from './screens/product/SearchScreen';
import SearchProduct from './screens/components/Search/SearchProduct';
import SpaScreen from './screens/service/SpaScreen';
import HomeSrceen from './screens/service/HomeScreen';

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <GluestackUIProvider config={config}>
      <NavigationContainer>
        <Stack.Navigator>
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
        </Stack.Navigator>
      </NavigationContainer>
    </GluestackUIProvider>
  );
}
