import { ArrowLeftIcon, View } from '@gluestack-ui/themed';
import React from 'react';
import { Button, Image, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import SearchProduct from '../components/Search/SearchProduct';
import { StyleSheet } from 'react-native';
import MenuBottom from '../components/Menu/MenuBottom';



const DetailProductScreen = ({navigation}:any) => {
    const [selected, setSelected] = React.useState(1);
    const [quantity, setQuantity] = React.useState(1);
    const product = {
        id: 1,
        name: 'Pate Cá ngừ cá hồi cho mèo',
        price: 20000,
        image: 'https://res.cloudinary.com/djjxfywxl/image/upload/v1701870045/purrpet/xdtrlludhqf3f6kuauyj.png',
        description: 'Độ ẩm ( tối đa) 90%, protein thô ( tối thiểu) 8%, béo thô ( tối thiểu) 0,2%, xơ thô ( tối đa) 1%, khoáng tổng số ( tối đa) 3%, hóa chất/ kháng sinh: không có.',
        inventory: 5,
    }
   
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
            <TouchableOpacity style={styles.button} onPress={()=>navigation.goBack()}>
                <ArrowLeftIcon size='xl' color='#C54600' alignSelf='center'  />
                </TouchableOpacity>
                <View style={styles.search} >
                <SearchProduct/>
                </View>
            </View>
            <View>
                <Image source={{uri: product.image}} style={[styles.image,{width: '100%', height: 300}]}/>
                <View style={styles.content}>
                    <Text style={styles.name}>{product.name}</Text>
                    <View style={styles.count}>
                        <Text style={styles.price}>đ {product.price}</Text>
                    <View style={styles.button}>
                        <Button title='-' onPress={() => setQuantity(quantity - 1)} disabled={quantity === 1} />
                        <Text style={{fontSize:20, margin:5 }}>{quantity}</Text>
                        <Button title='+' onPress={() => setQuantity(quantity + 1)} disabled={quantity === product.inventory}/>
                    </View>
                    </View>
                    <Text style={{fontSize:18, color:'#A16207', fontWeight:'bold', marginTop:10}}>Mô tả</Text>
                    <Text style={{marginTop: 10, marginBottom:20}}>{product.description}</Text>
                    <Button title='Thêm vào giỏ hàng' color='#C54600' />
                </View>
            </View>
            <MenuBottom selected={selected} />
        </SafeAreaView>
    );
    }
    const styles = StyleSheet.create({
        container:{
            flex: 1,
            backgroundColor: '#FDE047',
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 10,
            height: 70,
           
        },
        search:{
            width: '100%',
            paddingRight: 15,
        },
        image:{
            alignSelf: 'center',
        },
        content:{
            marginTop: 40,
            padding:20,
            backgroundColor: '#fff',
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
            height: '100%',
        },
        name:{
            fontSize: 16,
            fontWeight: 'bold',
            alignSelf: 'center',
            color: '#000',
        },
        count:{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 20,
        },
        price:{
            fontSize: 16,
            fontWeight: 'bold',
            color: '#C54600',
        },
        button:{
            flexDirection: 'row',
            justifyContent: 'space-between',
        }
    })

    export default DetailProductScreen;
