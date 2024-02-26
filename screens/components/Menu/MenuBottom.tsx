
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Icon, MenuIcon,BellIcon,  } from "@gluestack-ui/themed";
const MenuBottom = () => {
    const [selected, setSelected] = React.useState(1);
    return (
        <View style={[styles.container, styles.fixedContainer]}>
        <TouchableOpacity style={styles.button} onPress={()=>setSelected(0)}>
      
           
            <Icon as={MenuIcon} size='md' color={selected === 0 ? '#000' : '#CA8A04'}/>
            <Text style={selected === 0? styles.text1:styles.text2}>Sản phẩm</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setSelected(2)}>
            <Icon as={MenuIcon} color={selected === 2 ? '#000' : '#CA8A04'}/>
            <Text style={selected === 2? styles.text1:styles.text2}>Giỏ hàng</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setSelected(3)}>
            <Icon as={MenuIcon}  color={selected === 3 ? '#000' : '#CA8A04'}/>
            <Text style={selected === 3? styles.text1:styles.text2}>Dịch vụ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setSelected(4)}>
        <Icon as={BellIcon} size='md' color={selected === 4 ? '#000' : '#CA8A04'} />
            <Text style={selected === 4? styles.text1:styles.text2}>Thông báo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setSelected(5)}>
            <Icon as={MenuIcon}  color={selected === 5 ? '#000' : '#CA8A04'}/>
            <Text style={selected === 5? styles.text1:styles.text2} >Tài khoản</Text>
        </TouchableOpacity>
        </View>
    );
    }
    const styles = StyleSheet.create({
        container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        padding: 10,
        },
        fixedContainer: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
          },
        button: {
        alignItems: 'center',
        },
        text1: {
        color: '#000',
        },
        text2: {
            color: '#CA8A04',
            },
    });
    export default MenuBottom;