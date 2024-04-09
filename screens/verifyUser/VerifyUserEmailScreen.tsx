import { useState } from 'react';
import {
  Button,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ArrowLeftIcon, Icon } from '@gluestack-ui/themed';
import { sendOTP } from '../../api/otp';
import textInputStyles from '../styles/TextInputStyles.ts';
import buttonStyles from '../styles/ButtonStyles.ts';
import textStyles from '../styles/TextStyles.ts';
import viewStyles from '../styles/ViewStyles.ts';

const VerifyUserEmailScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState({ message: '', status: false });

  const handleEmailChange = (text: string) => {
    if (text.length > 0) {
      setError({ message: '', status: false });
    } else {
      setError({ message: 'Email không hợp lệ', status: true });
    }
    setEmail(text);
  };

  const handleSendOTP = () => {
    console.log('send otp:', email);
    if (!email) {
      setError({ message: 'Email không hợp lệ', status: true });
      return;
    }
    sendOTP({ email }).then((res) => {
      if (res.err === 0) {
        navigation.navigate('VerifyUserOTPScreen', { email });
      } else {
        setError({ message: 'Gửi OTP thất bại', status: true });
      }
    });
  };

  return (
    <SafeAreaView style={viewStyles.container}>
      <View style={viewStyles.titlePageBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeftIcon />
        </TouchableOpacity>
        <Text style={textStyles.title}>Xác thực người dùng</Text>
      </View>
      <View style={viewStyles.form}>
        <Text style={textStyles.label}>Email:</Text>
        <TextInput
          style={textInputStyles.textInputBorder}
          placeholder='Nhập email của bạn'
          placeholderTextColor={'#A0A0A0'}
          onChangeText={(text) => handleEmailChange(text)}
        />
        <View style={buttonStyles.buttonWrapper}>
          <TouchableOpacity
            style={buttonStyles.button}
            onPress={() => handleSendOTP()}
          >
            <Text style={buttonStyles.buttonText}>Gửi OTP</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default VerifyUserEmailScreen;
