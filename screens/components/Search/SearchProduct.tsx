import { MenuIcon, SearchIcon, SunIcon } from '@gluestack-ui/themed';
import { ShoppingCart } from 'lucide-react-native';
import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Button,
} from 'react-native';

const SearchProduct = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.input}
        onPress={() => navigation.navigate('SearchScreen')}
      >
        <Text style={{ fontSize: 16, color: '#C54600' }}>Tìm kiếm...</Text>
      </TouchableOpacity>
      <View style={styles.icon}>
        <TouchableOpacity onPress={() => navigation.navigate('SearchScreen')}>
          <SearchIcon color='#FDE047' size='xl' alignSelf='center' margin={9} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Giỏ hàng')}>
          <ShoppingCart color='#ca8a04' style={styles.image} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderColor: '#CA8A04',
    borderWidth: 1,
    margin: 10,
    borderRadius: 12,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    alignSelf: 'center',
  },
  image: {
    alignSelf: 'center',
    margin: 9,
  },
  icon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default SearchProduct;
