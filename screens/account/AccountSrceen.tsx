import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import textStyles from '../styles/TextStyles';
import buttonStyles from '../styles/ButtonStyles';
import { useCustomerStore } from '../../zustand/customerStore';
// import Realm from 'realm';
// import TokenSchema from '../../realmModel/TokenSchema';

const AccountScreen = ({ navigation, route }: any) => {
  const customerState = useCustomerStore((state) => state.customerState);

  const { logout } = useCustomerStore();

  // const realm = new Realm({ schema: [TokenSchema] });

  // useEffect(() => {
  //   console.log('customerStateEEEE:', customerState);
  //   const token = realm.objects('Token') as any;
  //   const accessToken = token[0]?.accessToken;
  //   console.log('accessToken:', accessToken);
  // }, [customerState]);

  const handleLogout = () => {
    console.log('logout');
    logout();
    navigation.navigate('Sản phẩm');
  };

  return (
    <SafeAreaView>
      <Text style={textStyles.title}>Thông tin tài khoản</Text>
      {Object.keys(customerState.data).length == 0 && (
        <View style={buttonStyles.buttonWrapper}>
          <TouchableOpacity
            style={buttonStyles.button}
            onPress={() => navigation.navigate('VerifyUserEmailScreen')}
          >
            <Text style={buttonStyles.buttonText}>Tra cứu đơn hàng</Text>
          </TouchableOpacity>
        </View>
      )}

      {Object.keys(customerState.data).length != 0 && (
        <>
          <Text style={textStyles.title}>
            Email: {customerState.data.email}
          </Text>
          <View style={buttonStyles.buttonWrapper}>
            <TouchableOpacity
              style={buttonStyles.button}
              onPress={() => handleLogout()}
            >
              <Text style={buttonStyles.buttonText}>Đăng xuất</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default AccountScreen;
