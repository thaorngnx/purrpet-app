import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native';
import { Text, View } from 'react-native';
import textStyles from '../styles/TextStyles';
import buttonStyles from '../styles/ButtonStyles';
import { useCustomerStore } from '../../zustand/customerStore';
import textInputStyles from '../styles/TextInputStyles';
import { useState } from 'react';
import { sendOTP } from '../../api/otp';

const UnverifyAccountScreen = ({ navigation }: any) => {
  const customerState = useCustomerStore((state) => state.customerState);

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
      <Text style={textStyles.title}>Thông tin tài khoản</Text>
      <View style={styles.form}>
        <Text style={textStyles.normal} className='mb-3'>
          Bạn chưa xác thực tài khoản. Vui lòng xác thực tài khoản để sử dụng
          tính năng này
        </Text>
        <TextInput
          style={textInputStyles.textInputBorder}
          placeholder='Email'
          placeholderTextColor={'#A0A0A0'}
          onChangeText={(text) => handleEmailChange(text)}
        />
        <View style={buttonStyles.buttonWrapper}>
          <TouchableOpacity
            style={buttonStyles.button}
            onPress={() => handleSendOTP()}
          >
            <Text style={buttonStyles.buttonText}>Tiếp tục</Text>
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

export default UnverifyAccountScreen;
