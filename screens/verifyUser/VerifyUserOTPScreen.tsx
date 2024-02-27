import React from "react";
import { SafeAreaView, StatusBar, StyleSheet, Text, TextInput, View } from "react-native";
import { ArrowLeftIcon, Icon } from '@gluestack-ui/themed';
import TextInputBorder from "../components/TextInput/TextInputBorder";
import LabelFormInput from "../components/LabelFormInput/LabelFormInput";
import TitlePage from "../components/TitlePage/TitlePage";
import TextHint from "../components/Text/TextHint";
import ButtonCommon from "../components/Button/ButtonCommon";

const VerifyUserOTPScreen = ({navigation}: any) => {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
            <ArrowLeftIcon />
            <TitlePage text="Xác thực người dùng OTP" />
            <View>
                <LabelFormInput text="Email" />
                <TextInputBorder placeholderText="Nhập email của bạn"/>
                <ButtonCommon title="Gửi mã xác thực" onPress={() => navigation.navigate('ProductScreen')} />
            </View>
            {/* <View>
                <TextHint text="OTP sẽ có hiệu lực trong vòng 5 phút!"/>
            </View> */}

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        margin: 10,
        flex: 1,
        backgroundColor: 'white',
    },
    icon: {
        width: 24,
        height: 24,
    },
    title: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
    },
    titleText: {
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default VerifyUserOTPScreen;