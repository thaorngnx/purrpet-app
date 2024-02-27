
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Icon, MenuIcon,BellIcon,  } from "@gluestack-ui/themed";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
interface MenuBottomProps {
    selected: number;
}
const MenuBottom: React.FC<MenuBottomProps> = ({ selected }) => {
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const setSelected = (index: number) => {
        setSelectedIndex(index);
        
    };
   
    return (
        <View style={[styles.container, styles.fixedContainer]}>
        <TouchableOpacity style={styles.button} onPress={()=>setSelected(0)}>
            <Icon as={MenuIcon} size='md' color={selectedIndex === 0 ? '#000' : '#CA8A04'}/>
            <Text style={selectedIndex === 0? styles.text1:styles.text2}>Sản phẩm</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setSelected(2)}>
            <Icon as={MenuIcon} color={selectedIndex === 2 ? '#000' : '#CA8A04'}/>
            <Text style={selectedIndex === 2? styles.text1:styles.text2}>Giỏ hàng</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setSelected(3)}>
            <Icon as={MenuIcon}  color={selectedIndex === 3 ? '#000' : '#CA8A04'}/>
            <Text style={selectedIndex === 3? styles.text1:styles.text2}>Dịch vụ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setSelected(4)}>
        <Icon as={BellIcon} size='md' color={selectedIndex === 4 ? '#000' : '#CA8A04'} />
            <Text style={selectedIndex === 4? styles.text1:styles.text2}>Thông báo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setSelected(5)}>
            <Icon as={MenuIcon}  color={selectedIndex === 5 ? '#000' : '#CA8A04'}/>
            <Text style={selectedIndex === 5? styles.text1:styles.text2} >Tài khoản</Text>
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
            zIndex: 1000,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
        },
        fixedContainer: {
            paddingBottom: 10,
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