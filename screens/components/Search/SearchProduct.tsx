import { BadgeText } from '@gluestack-ui/themed';
import { Badge, SearchIcon, VStack } from '@gluestack-ui/themed';
import { ShoppingCart } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useCartStore } from '../../../zustand/cartStore';

const SearchProduct = ({ navigation }: any) => {
  const cart = useCartStore((state) => state.cartState.data);
  const [numberCart, setNumberCart] = useState<number>(0);

  useEffect(() => {
    if (cart) {
      setNumberCart(cart.length);
    }
  }, [cart]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.input}
        onPress={() => navigation.navigate('SearchScreen')}
      >
        <Text style={{ fontSize: 16, color: '#F43F5E' }}>Tìm kiếm...</Text>
      </TouchableOpacity>
      <View style={styles.icon} className='flex'>
        <TouchableOpacity
          onPress={() => navigation.navigate('SearchScreen')}
          className='justify-center'
        >
          <SearchIcon color='#3B82F6' size='xl' />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Giỏ hàng')}
          className='justify-center mr-2'
        >
          <VStack>
            <Badge
              h={22}
              w={22}
              bg='pink'
              borderRadius='$full'
              mb={-20}
              mr={-5}
              zIndex={1}
              variant='solid'
              alignSelf='flex-end'
            >
              <BadgeText>{numberCart}</BadgeText>
            </Badge>
            <ShoppingCart color='#3B82F6' style={styles.image} />
          </VStack>
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
    borderColor: '#3B82F6',
    borderWidth: 1,
    margin: 10,
    borderRadius: 12,
    flex: 1,
    height: 50,
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
