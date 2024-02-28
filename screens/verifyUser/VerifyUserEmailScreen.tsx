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
      console.log(res);
      if (res.err === 0) {
        navigation.navigate('VerifyUserOTPScreen', { email });
      } else {
        setError({ message: 'Gửi OTP thất bại', status: true });
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <ArrowLeftIcon />
      </TouchableOpacity>
      <Text style={textStyles.title}>Xác thực người dùng</Text>
      <View style={styles.form}>
        <Text style={textStyles.label}>Email:</Text>
        <TextInput
          style={textInputStyles.textInputBorder}
          placeholder='Nhập email của bạn'
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

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    flex: 1,
    backgroundColor: 'white',
  },
  form: {
    padding: 15,
  },
  icon: {
    width: 24,
    height: 24,
  },
});

export default VerifyUserEmailScreen;
