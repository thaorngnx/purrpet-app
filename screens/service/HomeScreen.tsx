import React from 'react';
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Icon, ChevronLeftIcon } from '@gluestack-ui/themed';
import Swiper from 'react-native-swiper';
import textStyles from '../styles/TextStyles';
import buttonStyles from '../styles/ButtonStyles';

const HomeSrceen = ({ navigation }: any) => {
  const images = [
    {
      source: require('../../assets/banner.png'),
    },
    {
      source: require('../../assets/Banner1.png'),
    },
    {
      source: require('../../assets/Banner2.png'),
    },
    {
      source: require('../../assets/Banner3.png'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.icon}
          onPress={() => navigation.goBack()}
        >
          <Icon as={ChevronLeftIcon} size='xl' color='#B91C1C' />
        </TouchableOpacity>
        <Text style={styles.text}>HomeStay for Pet</Text>
        <Image
          source={require('../../assets/DogHouse.png')}
          style={{ alignSelf: 'center' }}
        />
        <Image
          source={require('../../assets/Purrshop1.png')}
          style={{ width: '15%', height: 58, alignSelf: 'center' }}
        />
      </View>
      <ScrollView style={{ marginBottom: 20 }}>
        <View style={styles.slideShow}>
          <Swiper autoplay={true} autoplayTimeout={3}>
            {images.map((image, index) => (
              <View key={index} style={styles.slide}>
                <Image source={image.source} style={styles.image} />
              </View>
            ))}
          </Swiper>
        </View>

        <View style={{ marginTop: 30 }}>
          <View style={styles.content}>
            <Image
              source={require('../../assets/SizeS.png')}
              style={{
                marginTop: 20,
                alignSelf: 'center',
              }}
            />
            <Text
              style={{
                color: '#CA8A04',
                fontSize: 20,
                fontWeight: 'bold',
                marginLeft: 20,
                marginTop: 20,
              }}
            >
              Phòng Size S
            </Text>
            <Text
              style={{
                marginLeft: 20,
                color: '#000',
                fontSize: 16,
                fontWeight: 'bold',
              }}
            >
              Giá theo ngày
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginLeft: 20,
                marginRight: 20,
                alignItems: 'center',
                marginBottom: 20,
              }}
            >
              <Text
                style={{
                  color: '#000',
                  fontSize: 14,
                  fontWeight: 'bold',
                  alignSelf: 'center',
                }}
              >
                60.000đ - 120.000đ
              </Text>
              <TouchableOpacity
                style={buttonStyles.button}
                onPress={() => navigation.navigate('BookingHomeScreen')}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                  Đặt phòng ngay
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={{ marginTop: 30 }}>
          <View style={styles.content}>
            <Image
              source={require('../../assets/SizeM.png')}
              style={{
                marginTop: 20,
                alignSelf: 'center',
              }}
            />
            <Text
              style={{
                color: '#CA8A04',
                fontSize: 20,
                fontWeight: 'bold',
                marginLeft: 20,
                marginTop: 20,
              }}
            >
              Phòng Size M
            </Text>
            <Text
              style={{
                marginLeft: 20,
                color: '#000',
                fontSize: 16,
                fontWeight: 'bold',
              }}
            >
              Giá theo ngày
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginLeft: 20,
                marginRight: 20,
                alignItems: 'center',
                marginBottom: 20,
              }}
            >
              <Text
                style={{
                  color: '#000',
                  fontSize: 14,
                  fontWeight: 'bold',
                  alignSelf: 'center',
                }}
              >
                90.000đ - 150.000đ
              </Text>
              <TouchableOpacity
                style={buttonStyles.button}
                onPress={() => navigation.navigate('BookingHomeScreen')}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                  Đặt phòng ngay
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={{ marginTop: 30 }}>
          <View style={styles.content}>
            <Image
              source={require('../../assets/SizeL.png')}
              style={{
                marginTop: 20,
                alignSelf: 'center',
              }}
            />
            <Text
              style={{
                color: '#CA8A04',
                fontSize: 20,
                fontWeight: 'bold',
                marginLeft: 20,
                marginTop: 20,
              }}
            >
              Phòng Size L
            </Text>
            <Text
              style={{
                marginLeft: 20,
                color: '#000',
                fontSize: 16,
                fontWeight: 'bold',
              }}
            >
              Giá theo ngày
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginLeft: 20,
                marginRight: 20,
                alignItems: 'center',
                marginBottom: 20,
              }}
            >
              <Text
                style={{
                  color: '#000',
                  fontSize: 14,
                  fontWeight: 'bold',
                  alignSelf: 'center',
                }}
              >
                100.000đ - 200.000đ
              </Text>
              <TouchableOpacity
                style={buttonStyles.button}
                onPress={() => navigation.navigate('BookingHomeScreen')}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                  Đặt phòng ngay
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={{ marginTop: 40 }}>
          <View style={{ margin: 10 }}>
            <Text style={textStyles.title}>
              QUY TRÌNH CHĂM SÓC THÚ CƯNG TẠI PURRPET
            </Text>
            <Image
              source={require('../../assets/chamsoc.jpg')}
              style={{
                alignSelf: 'center',
                marginTop: 10,
                width: 410,
                height: 700,
              }}
            />
          </View>
          <View style={{ margin: 40 }}>
            <Text style={textStyles.title}>
              QUY TRÌNH TIẾP NHẬN THÚ CƯNG TẠI PURRPET
            </Text>
            <Image
              source={require('../../assets/tiepnhan.jpg')}
              style={{
                alignSelf: 'center',
                marginTop: 10,
                width: 420,
                height: 700,
              }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBCFE8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 90,
    padding: 10,
  },
  text: {
    fontSize: 18,
    color: '#000000',
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  icon: {
    alignSelf: 'center',
  },
  slideShow: {
    height: 200,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  content: {
    backgroundColor: '#fff',
    width: 340,
    alignSelf: 'center',
  },
});
export default HomeSrceen;
