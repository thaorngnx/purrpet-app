import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import viewStyles from '../styles/ViewStyles';
import { TouchableOpacity } from 'react-native';
import { ArrowLeftIcon } from '@gluestack-ui/themed';
import textStyles from '../styles/TextStyles';
import { BedSingle, Dog, ShoppingBag } from 'lucide-react-native';
import buttonStyles from '../styles/ButtonStyles';

const HistoryScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={viewStyles.container}>
      <View style={viewStyles.titlePageBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeftIcon />
        </TouchableOpacity>
        <Text style={textStyles.title}>Đơn hàng của tôi</Text>
      </View>
      <TouchableOpacity
        style={buttonStyles.colorOutlineCard}
        onPress={() => navigation.navigate('OrderHistoryScreen')}
      >
        <ShoppingBag style={styles.icon} />
        <Text style={textStyles.normal}>Đơn đặt hàng</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={buttonStyles.colorOutlineCard}
        onPress={() => navigation.navigate('SpaHistoryScreen')}
      >
        <Dog style={styles.icon} />
        <Text style={textStyles.normal}>Đơn đặt lịch spa</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={buttonStyles.colorOutlineCard}
        onPress={() => navigation.navigate('HomestayHistoryScreen')}
      >
        <BedSingle style={styles.icon} />
        <Text style={textStyles.normal}>Đơn đặt phòng</Text>
      </TouchableOpacity>
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
    marginRight: 10,
  },
});

export default HistoryScreen;
