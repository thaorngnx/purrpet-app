import { Badge, ChevronLeftIcon, SearchIcon } from '@gluestack-ui/themed';
import React, { useEffect } from 'react';
import {
  TextInput,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
  SafeAreaView,
  Text,
} from 'react-native';
import { getActiveCategories } from '../../api/category';
import * as CONST from '../constants';
import textStyles from '../styles/TextStyles';
import { useState } from 'react';
import { Category } from '../../interface/Category';
import { ShoppingCart } from 'lucide-react-native';
import { useCategoryStore } from '../../zustand/categoryStore';

const SearchScreen = ({ navigation }: any) => {
  const [search, setSearch] = useState('');
  const categories: Category[] = useCategoryStore(
    (state) => state.categoryState.data,
  );

  const handleKeyPress = () => {
    navigation.navigate('Sản phẩm', { search });
  };

  const handleChange = (text: string) => {
    setSearch(text);
  };

  return (
    <SafeAreaView>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconLeft}
          onPress={() => navigation.goBack()}
        >
          <ChevronLeftIcon size='xl' color='#1D4ED8' />
        </TouchableOpacity>
        <View style={styles.input}>
          <View style={styles.inputText}>
            <SearchIcon
              color='#1D4ED8'
              size='xl'
              alignSelf='center'
              margin={9}
            />
            <TextInput
              placeholder='Bạn đang tìm gì ?'
              onChangeText={handleChange}
              onSubmitEditing={handleKeyPress}
              style={{ color: '#000000' }}
            />
          </View>
          <TouchableOpacity
            style={styles.iconCart}
            onPress={() => navigation.navigate('Giỏ hàng')}
          >
            <ShoppingCart color='#1d4e7e' />
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <Text style={textStyles.label}> Gợi ý cho bạn:</Text>
        <View style={styles.content}>
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => navigation.navigate('Sản phẩm', { category })}
            >
              <Text style={styles.textCate}>{category.categoryName}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    height: 94,
    backgroundColor: '#BAE6FD',
    padding: 10,
  },
  input: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderColor: '#CA8A04',
    borderWidth: 1,
    margin: 10,
    borderRadius: 12,
    width: '90%',
  },
  inputText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 10,
    alignSelf: 'center',
    borderColor: '#BAE6FD',
  },
  iconLeft: {
    alignSelf: 'center',
  },
  iconCart: {
    alignSelf: 'center',
    margin: 9,
  },
  content: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  textCate: {
    backgroundColor: '#DBDBDB',
    margin: 10,
    borderRadius: 5,
    width: 100,
    textAlign: 'center',
    color: '#000000',
  },
});
export default SearchScreen;
