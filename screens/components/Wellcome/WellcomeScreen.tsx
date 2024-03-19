import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, Animated } from 'react-native';
import { Progress, ProgressFilledTrack, Spinner } from '@gluestack-ui/themed';
import { useCustomerStore } from '../../../zustand/customerStore';
import { useCartStore } from '../../../zustand/cartStore';
import TokenSchema from '../../../realmModel/TokenSchema';
import Realm from 'realm';
import { jwtDecode } from 'jwt-decode';

const WelcomeScreen = ({ navigation }: any) => {
  const { getCustomerById } = useCustomerStore();
  const { getCart } = useCartStore();
  //get customer from realm
  const realm = new Realm({ schema: [TokenSchema] });
  const token = realm.objects('Token') as any;
  let accessToken = '';
  if (token.length > 0) {
    accessToken = token[0]?.accessToken;
  }

  // useEffect(() => {
  //   //get cart from server
  //   getCart();
  // }, []);

  //get customer info from server
  useEffect(() => {
    if (accessToken) {
      const decoded = jwtDecode(accessToken) as any;
      //get customer info from server
      getCustomerById(decoded.id);
    }
  }, [accessToken]);

  const progressValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    getCart();
    const animation = Animated.timing(progressValue, {
      toValue: 100,
      duration: 5000, // Thời gian hoàn thành của Progress (tính theo milliseconds)
      useNativeDriver: false,
    });

    animation.start(() => {
      // Hoàn thành animate, điều hướng đến MenuBottom
      navigation.navigate('MenuBottom');
    });

    return () => animation.stop();
  }, [navigation]);

  return (
    <View style={{ position: 'relative' }}>
      <Image
        source={require('../../../assets/PurrPetShop.png')}
        style={{ width: '100%', height: '100%' }}
      />
      <View style={{ position: 'absolute', bottom: 20, left: 20, right: 20 }}>
        <Animated.View
          style={{
            width: '100%',
            height: 15,
            borderRadius: 5,
            backgroundColor: '#e0e0e0',
          }}
        >
          <Animated.View
            style={{
              width: progressValue.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
              height: '100%',
              borderRadius: 5,
              backgroundColor: '#4caf50',
            }}
          />
        </Animated.View>
      </View>
    </View>
  );
};

export default WelcomeScreen;
