import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, Image } from 'react-native';
import SearchProduct from '../components/Search/SearchProduct';
import textStyles from '../styles/TextStyles';
import { Link, LinkText } from '@gluestack-ui/themed';

const NotificationScreen = ({ navigation }: any) => {
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
            fontSize: 18,
          }}
        >
          Thông báo
        </Text>
      </View>
      <View style={{ margin: 30 }}>
        <Image
          source={require('../../assets/image7.png')}
          style={{ alignSelf: 'center' }}
        />
        <Text style={textStyles.label}>Bạn chưa có thông báo nào!!</Text>
        <Text style={textStyles.label}>
          Hãy xác minh tài khoản để nhận thông báo!
        </Text>
        <Link onPress={() => navigation.navigate('Tài khoản')}>
          <LinkText style={{ alignSelf: 'center' }}>Tài khoản</LinkText>
        </Link>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  header: {
    backgroundColor: '#BAE6FD',
    height: 70,
  },
});
export default NotificationScreen;
