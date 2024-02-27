import * as React from 'react';
import { View, Text, SafeAreaView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Icon, ChevronLeftIcon } from "@gluestack-ui/themed";
const SpaScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>  
           <TouchableOpacity style={styles.icon} >
           <Icon as={ChevronLeftIcon} size='xl' color='#B91C1C'/>
            </TouchableOpacity> 
            <Text style={styles.text}>Spa for Pet</Text>
            <Image source={require('../../assets/Purrshop1.png')} style={{width: '15%', height: 58, alignSelf:'center'}}/>
            </View>
        </SafeAreaView>
    );
    }
    const styles = StyleSheet.create({
        container: {
        flex: 1,
        backgroundColor: '#FDE047',
        },
        header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 90,
        padding: 10,
        },
        text: {
            fontSize: 18,
            color: '#C54600',
            fontWeight: 'bold',
            fontStyle: 'italic',
            alignSelf: 'center',
        },
        icon:{
            alignSelf: 'center',
        }
    });
    export default SpaScreen;