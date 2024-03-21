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
          style={styles.logo}
        />
      </View>
      <Image
        source={require('../../assets/service1.png')}
        style={styles.serviceImage}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('SpaScreen')}>
          <Image
            source={require('../../assets/spa1.png')}
            style={styles.buttonImage}
          />
          <Text style={styles.buttonText}>Spa</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
          <Image
            source={require('../../assets/home1.png')}
            style={styles.buttonImage}
          />
          <Text style={styles.buttonText}>HomeStay</Text>
        </TouchableOpacity>
      </View>
      <Image
        source={require('../../assets/bottomImage.png')}
        style={styles.bottomImage}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#BAE6FD',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 80,
    padding: 20,
  },
  text: {
    fontSize: 18,
    color: '#000000',
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  logo: {
    width: '15%',
    height: 55,
    alignSelf: 'center',
  },
  serviceImage: {
    width: '100%',
    height: 430,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 20,
  },
  buttonImage: {
    width: 113,
    height: 100,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bottomImage: {
    width: 360,
    height: 79,
    alignSelf: 'center',
    marginTop: 30,
  },
});

export default ServiceScreen;
