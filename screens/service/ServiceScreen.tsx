import { Menu, View } from '@gluestack-ui/themed';
import { Text, Image, SafeAreaView } from 'react-native';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

const ServiceScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text}>PURRPET SHOP</Text>
        <Image
          source={require('../../assets/Purrshop1.png')}
          style={{ width: '15%', height: 55, alignSelf: 'center' }}
        />
      </View>
      <Image
        source={require('../../assets/service1.png')}
        style={{ width: '100%', height: 402 }}
      />
      <View style={styles.button}>
        <TouchableOpacity onPress={() => navigation.navigate('SpaScreen')}>
          <Image
            source={require('../../assets/spa1.png')}
            style={{ width: 113, height: 100 }}
          />
          <Text
            style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}
          >
            Spa
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
          <Image
            source={require('../../assets/home1.png')}
            style={{ width: 113, height: 100 }}
          />
          <Text
            style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}
          >
            HomeStay
          </Text>
        </TouchableOpacity>
      </View>
      <Image
        source={require('../../assets/bottomImage.png')}
        style={{ width: 360, height: 79, alignSelf: 'center', marginTop: 10 }}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDE047',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 80,
    padding: 20,
  },
  text: {
    fontSize: 18,
    color: '#C54600',
    fontWeight: 'bold',
    fontStyle: 'italic',
    alignSelf: 'center',
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});
export default ServiceScreen;
