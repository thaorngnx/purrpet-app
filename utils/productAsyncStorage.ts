import { get } from '@gluestack-style/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
// const saveRecentlyViewedProducts = async (products: any) => {
//   try {
//     const existingValue = await AsyncStorage.getItem('recentlyViewedProducts');
//     let updatedRecentlyViewedProducts = [];
//     if (existingValue) {
//       const existingProducts = JSON.parse(existingValue);
//       updatedRecentlyViewedProducts = [...existingProducts, ...products];
//     } else {
//       updatedRecentlyViewedProducts = products;
//     }
//     const jsonValue = JSON.stringify(updatedRecentlyViewedProducts);
//     await AsyncStorage.setItem('recentlyViewedProducts', jsonValue);
//   } catch (error) {
//     console.error('Error saving recently viewed products:', error);
//   }
// };

export const addRecentlyViewedProduct = async (product: any) => {
  const getProducts = await getRecentlyViewedProducts();
  const productsArray = Array.isArray(getProducts) ? getProducts : [];
  if (productsArray.length > 0) {
    const index = productsArray.findIndex(
      (item: any) => item.purrPetCode === product.purrPetCode,
    );
    if (index === -1) {
      productsArray.unshift(product);
      if (productsArray.length > 10) {
        productsArray.pop();
      }
      await AsyncStorage.setItem(
        'recentlyViewedProducts',
        JSON.stringify(productsArray),
      );
    } else {
      console.log('Sản phẩm đã được thêm ');
    }
  } else {
    console.log('Sản phẩm chưa được thêm');
    await AsyncStorage.setItem(
      'recentlyViewedProducts',
      JSON.stringify([product]),
    );
  }
};

// Truy xuất sản phẩm gần đây
export const getRecentlyViewedProducts = async () => {
  try {
    const value = await AsyncStorage.getItem('recentlyViewedProducts');
    if (value) {
      const productList = JSON.parse(value);
      return productList;
    } else {
      return [];
    }
  } catch (error) {
    console.log('Lỗi khi truy xuất sản phẩm gần đây:', error);
    return [];
  }
};
export const clearRecentlyViewedProducts = async () => {
  try {
    await AsyncStorage.removeItem('recentlyViewedProducts');
    console.log('Đã xoá tất cả sản phẩm gần đây');
  } catch (error) {
    console.error('Lỗi khi xoá sản phẩm gần đây:', error);
  }
};
