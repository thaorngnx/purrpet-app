import { GluestackUIProvider, Text } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config'; // Optional if you want to use default theme
import VerifyUserEmailScreen from './screens/verifyUser/VerifyUserEmailScreen';

// import ProductPage from './screens/product/ProductPage';
// import AppNavigator from './AppNavigator';

export default function App() {
  return (
    <GluestackUIProvider config={config}>
      <VerifyUserEmailScreen />
      {/* <ProductPage /> */}
    </GluestackUIProvider>
  );
}