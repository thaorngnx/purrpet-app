import React, { useEffect, useState, useRef } from 'react';
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
import {
  ArrowLeftIcon,
  CloseIcon,
  Heading,
  Icon,
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Popover,
  set,
} from '@gluestack-ui/themed';
import { sendOTP, verifyOTP } from '../../api/otp';
import textInputStyles from '../styles/TextInputStyles.ts';
import buttonStyles from '../styles/ButtonStyles.ts';
import textStyles from '../styles/TextStyles.ts';
import { useCustomerStore } from '../../zustand/customerStore.ts';
import viewStyles from '../styles/ViewStyles.ts';
import { validateEmail } from '../../utils/validationData.ts';
import { useFavoriteStore } from '../../zustand/favoriteStore.ts';

const VerifyUserOTPScreen = ({ navigation, route }: any) => {
  // const customerState = useCustomerStore((state) => state.customerState);

  const { setCustomer } = useCustomerStore();
  const [email, setEmail] = useState('');
  const [error, setError] = useState({ message: '', status: false });
  const [otp, setOTP] = useState(['', '', '', '']);
  const [isOpen, setIsOpen] = useState(false);
  const { getFavorite } = useFavoriteStore();

  const otpInputs = useRef<TextInput[]>([]);

  useEffect(() => {
    setEmail(route.params?.email);
  }, []);

  const handleOTPChange = (value: string, index: number) => {
    const newOTP = [...otp];
    newOTP[index] = value;
    setOTP(newOTP);

    if (value && index < otp.length - 1) {
      otpInputs.current[index + 1].focus();
    }
  };

  const handleBackspacePress = (index: number) => {
    if (index > 0) {
      const newOTP = [...otp];
      newOTP[index - 1] = '';
      setOTP(newOTP);
      otpInputs.current[index - 1]?.focus();
    }
  };

  const handleSendOTP = () => {
    console.log('send otp');
    console.log(validateEmail(email));
    if (!email || validateEmail(email) === false) {
      setError({ message: 'Email không hợp lệ', status: true });
      return;
    }

    sendOTP({ email }).then((res) => {
      if (res) {
        navigation.navigate('VerifyUserOTPScreen');
      }
    });
  };

  const handleVerifyOTP = () => {
    console.log('verify otp');

    const otpJoin = otp.join('');

    if (otpJoin.length < 4) {
      setError({ message: 'Mã OTP không hợp lệ', status: true });
    }

    verifyOTP({ email, otp: otpJoin }).then((res) => {
      if (res.err == 0) {
        if (res.data !== null) {
          console.log('verify success');
          setCustomer(res.data);
          getFavorite();

          navigation.navigate('Tài khoản');
        } else {
          setIsOpen(true);
        }
      } else {
        setError({ message: 'Mã OTP không hợp lệ', status: true });
        setOTP(['', '', '', '']);
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
      <View style={viewStyles.titlePageBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeftIcon />
        </TouchableOpacity>
        <Text style={textStyles.title}>Xác thực email</Text>
      </View>
      <View style={{ marginVertical: 5 }}>
        <Text style={textStyles.hint}>Mã OTP đã được gửi đến email</Text>
        <Text style={textStyles.hintBoldItalic}>{email}</Text>
      </View>
      <Text style={textStyles.error}>{error.message}</Text>
      <View style={styles.form}>
        <View style={styles.otpForm}>
          {otp.map((value, index) => (
            <TextInput
              key={index}
              ref={(ref) => (otpInputs.current[index] = ref as TextInput)}
              value={value}
              onChangeText={(text) => handleOTPChange(text, index)}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === 'Backspace') {
                  handleBackspacePress(index);
                }
              }}
              keyboardType='number-pad'
              maxLength={1}
              style={textInputStyles.otpInput}
              caretHidden={true}
            />
          ))}
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
            onPress={() => handleVerifyOTP()}
          >
            <Text style={buttonStyles.buttonText}>Xác thực</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading size='lg'>Thông Báo</Heading>
          </ModalHeader>
          <ModalBody>
            <Text className='text-black'>
              Hiện tại tài khoản của quý khách chưa có đơn hàng nào. Mời bạn
              tiếp tục mua hàng
            </Text>
          </ModalBody>
          <ModalFooter>
            <TouchableOpacity
              style={buttonStyles.button}
              onPress={() => {
                setIsOpen(false);
                navigation.navigate('Sản phẩm');
              }}
            >
              <Text className='text-black font-bold'>Tiếp tục mua sắm</Text>
            </TouchableOpacity>
            {/* <Button
              variant='outline'
              size='sm'
              action='secondary'
              mr='$3'
              onPress={() => {
                setShowModal(false);
              }}
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button
              size='sm'
              action='positive'
              borderWidth='$0'
              onPress={() => {
                setShowModal(false);
              }}
            >
              <ButtonText>Explore</ButtonText>
            </Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>
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
