import { SafeAreaView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { View } from 'react-native';
import textStyles from '../styles/TextStyles';
import viewStyles from '../styles/ViewStyles';
import { useCustomerStore } from '../../zustand/customerStore';
import buttonStyles from '../styles/ButtonStyles';
import { LogOut, ShoppingBag, SquareUser } from 'lucide-react-native';

const AccountScreen = ({ navigation }: any) => {
  const customer = useCustomerStore((state) => state.customerState.data);

  const { logout } = useCustomerStore();

  const handleLogout = () => {
    console.log('logout');
    logout();
    navigation.navigate('Sản phẩm');
  };

  return (
    <SafeAreaView style={viewStyles.container}>
      <View style={viewStyles.titlePageBar}>
        <Text style={textStyles.title}>Tài khoản</Text>
      </View>
      <View style={viewStyles.card}>
        <View style={viewStyles.flexRow}>
          <Text style={textStyles.label}>Khách hàng: </Text>
          <Text style={textStyles.normal}>{customer.name}</Text>
        </View>
        <View style={viewStyles.flexRow}>
          <Text style={textStyles.label}>Email: </Text>
          <Text style={textStyles.normal}>{customer.email}</Text>
        </View>
      </View>
      <View style={viewStyles.card}>
        <TouchableOpacity
          style={styles.option}
          onPress={() => navigation.navigate('AccountInfoScreen')}
        >
          <SquareUser style={styles.icon} />
          <Text style={textStyles.normal}>Thông tin tài khoản</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.option}
          onPress={() => navigation.navigate('HistoryScreen')}
        >
          <ShoppingBag style={styles.icon} />
          <Text style={textStyles.normal}>Đơn hàng của tôi</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => handleLogout()}>
          <LogOut style={styles.icon} />
          <Text style={textStyles.normal}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  option: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  icon: {
    color: 'black',
    marginRight: 5,
  },
});

export default AccountScreen;