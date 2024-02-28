import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import SearchProduct from '../components/Search/SearchProduct';
import textStyles from '../styles/TextStyles';

const CartScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={{ backgroundColor: '#ffff', height: '100%' }}>
      <View style={styles.header}>
        <SearchProduct navigation={navigation} />
      </View>
      <View style={{ borderBottomWidth: 1 }}>
        <Text
          style={{
            alignSelf: 'center',
            color: '#000',
            fontWeight: 'bold',
            margin: 10,
          }}
        >
          Giỏ hàng của bạn
        </Text>
      </View>
      <Image
        source={require('../../assets/cart.png')}
        style={{ alignSelf: 'center', marginTop: 30 }}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Sản phẩm')}
      >
        <Text
          style={{
            alignSelf: 'center',
            color: '#fff',
            fontWeight: 'bold',
            marginTop: 9,
            fontSize: 16,
          }}
        >
          Tiếp tục mua sắm
        </Text>
      </TouchableOpacity>
      <View>
        <Text style={{ alignSelf: 'center' }}>
          Vẫn còn hơn 1000 sản phẩm đang chờ
        </Text>
        <Image
          source={require('../../assets/Frame1000002068.png')}
          style={{ alignSelf: 'center', marginTop: 10 }}
        />
        <Image
          source={require('../../assets/Frame1000002086.png')}
          style={{ alignSelf: 'center', marginTop: 10 }}
        />
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FDE047',
    height: 70,
  },
  button: {
    backgroundColor: '#CA8A04',
    width: '50%',
    height: 40,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 20,
  },
});

export default CartScreen;
