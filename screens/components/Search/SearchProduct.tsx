import { MenuIcon, SearchIcon, SunIcon } from '@gluestack-ui/themed';
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
const SearchProduct = () => {
    return(
        <View style={styles.container}>
           <TextInput style={styles.input} placeholder="Tìm kiếm..." />
           <SearchIcon color='#FDE047' size='lg' alignSelf='center' margin={9}/>
           <SunIcon color='#FDE047' size='lg' alignSelf='center' margin={9}/>
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
        },
   
});

export default SearchProduct;
