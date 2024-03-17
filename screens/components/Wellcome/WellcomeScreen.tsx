import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, Animated } from 'react-native';
import { Progress, ProgressFilledTrack, Spinner } from '@gluestack-ui/themed';

const WelcomeScreen = ({ navigation }: any) => {
  const progressValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.timing(progressValue, {
      toValue: 100,
      duration: 3000, // Thời gian hoàn thành của Progress (tính theo milliseconds)
      useNativeDriver: false,
    });

    animation.start(() => {
      navigation.navigate('MenuBottom');
    });

    return () => animation.stop();
  }, []);

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
