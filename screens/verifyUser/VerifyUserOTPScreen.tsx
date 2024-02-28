import { useEffect, useState } from 'react';
import {
  Button,
  Linking,
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

const VerifyUserOTPScreen = ({ navigation, route }: any) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setEmail(route.params?.email);
  }, []);

  const handleEmailChange = (text: string) => {
    if (text.length > 0) {
      setError(false);
    } else {
      setError(true);
    }
    setEmail(text);
  };

  const handleSendOTP = () => {
    console.log('send otp');
    console.log(email);
    if (!email) {
      setError(true);
      return;
    }
    sendOTP(email).then((res) => {
      console.log(res);
      if (res) {
        navigation.navigate('VerifyUserOTPScreen');
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
      <ArrowLeftIcon />
      <Text style={textStyles.title}>Xác thực email</Text>
      <View style={{ marginVertical: 5 }}>
        <Text style={textStyles.hint}>Mã OTP đã được gửi đến email</Text>
        <Text style={textStyles.hintBoldItalic}>{email}</Text>
      </View>
      <View style={styles.form}>
        <View style={styles.otpForm}>
          <TextInput
            style={textInputStyles.otpInput}
            onChangeText={(text) => handleEmailChange(text)}
          />
          <TextInput
            style={textInputStyles.otpInput}
            onChangeText={(text) => handleEmailChange(text)}
          />
          <TextInput
            style={textInputStyles.otpInput}
            onChangeText={(text) => handleEmailChange(text)}
          />
          <TextInput
            style={textInputStyles.otpInput}
            onChangeText={(text) => handleEmailChange(text)}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 5,
          }}
        >
          <Text style={textStyles.hint}>Bạn chưa nhận được mail? </Text>
          <TouchableOpacity onPress={() => handleSendOTP()}>
            <Text style={styles.link}>Gửi lại</Text>
          </TouchableOpacity>
        </View>
        <View style={buttonStyles.buttonWrapper}>
          <TouchableOpacity
            style={buttonStyles.button}
            onPress={() => handleSendOTP()}
          >
            <Text style={buttonStyles.buttonText}>Xác thực</Text>
          </TouchableOpacity>
        </View>
        <Text className='font-serif bg-black text-white'>
          Mã OTP không đúng
        </Text>
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
  otpForm: {
    padding: 15,
    paddingHorizontal: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  link: {
    fontSize: 12,
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    color: 'blue',
    textAlign: 'center',
    marginVertical: 5,
  },
});

export default VerifyUserOTPScreen;
