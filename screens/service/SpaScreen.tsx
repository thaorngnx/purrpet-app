import * as React from 'react';
import { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Icon, ChevronLeftIcon, CloseIcon } from '@gluestack-ui/themed';
import textStyles from '../styles/TextStyles';
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@gluestack-ui/themed';
import buttonStyles from '../styles/ButtonStyles';

const SpaScreen = ({ navigation }: any) => {
  const [showModalSliver, setShowModalSliver] = useState(false);
  const [showModalGold, setShowModalGold] = useState(false);
  const [showModalPlatium, setShowModalPlatium] = useState(false);
  const [showModalDiamond, setShowModalDiamond] = useState(false);
  const ref = React.useRef(null);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.icon}
          onPress={() => navigation.goBack()}
        >
          <Icon as={ChevronLeftIcon} size='xl' color='#B91C1C' />
        </TouchableOpacity>
        <View style={styles.title}>
          <Text style={styles.text}>Spa for Pet</Text>
          <Image
            style={styles.icon}
            source={require('../../assets/heart.png')}
          />
        </View>
        <Image
          source={require('../../assets/Purrshop1.png')}
          style={{ width: '15%', height: 58, alignSelf: 'center' }}
        />
      </View>
      <View style={styles.content}>
        <Text style={textStyles.title}>Các gói dịch vụ</Text>
        <View style={styles.service}>
          <TouchableOpacity onPress={() => setShowModalSliver(true)}>
            <Image source={require('../../assets/spa2.png')} />
            <Text>Sliver</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowModalGold(true)}>
            <Image source={require('../../assets/spa3.png')} />
            <Text>Gold</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowModalPlatium(true)}>
            <Image source={require('../../assets/spa4.png')} />
            <Text>Platium</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowModalDiamond(true)}>
            <Image source={require('../../assets/spa5.png')} />
            <Text>Diamond</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        isOpen={showModalSliver}
        onClose={() => {
          setShowModalSliver(false);
        }}
        finalFocusRef={ref}
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <ModalCloseButton>
              <CloseIcon size='xl' color='#B91C1C' />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <Image source={require('../../assets/Sliver.png')} />
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={showModalGold}
        onClose={() => {
          setShowModalGold(false);
        }}
        finalFocusRef={ref}
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <ModalCloseButton>
              <CloseIcon size='xl' color='#B91C1C' />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <Image source={require('../../assets/Gold.png')} />
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={showModalPlatium}
        onClose={() => {
          setShowModalPlatium(false);
        }}
        finalFocusRef={ref}
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <ModalCloseButton>
              <CloseIcon size='xl' color='#B91C1C' />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <Image source={require('../../assets/Platium.png')} />
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={showModalDiamond}
        onClose={() => {
          setShowModalDiamond(false);
        }}
        finalFocusRef={ref}
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <ModalCloseButton>
              <CloseIcon size='xl' color='#B91C1C' />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <Image source={require('../../assets/Diamond.png')} />
          </ModalBody>
        </ModalContent>
      </Modal>
      <ScrollView style={{ marginBottom: 40 }}>
        <View style={styles.form}>
          <View style={styles.title}>
            <Text style={textStyles.title}>Dịch vụ Spa cho chó</Text>
            <Image source={require('../../assets/dog&cat1.png')} />
          </View>
          <View style={styles.title}>
            <Text
              style={{
                fontSize: 17,
                color: '#000',
                alignSelf: 'center',
                marginRight: 10,
              }}
            >
              120.000đ - 750.000đ
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('BookingSpaScreen')}
            >
              <Text
                style={{
                  color: '#005DB4',
                  fontSize: 18,
                  fontWeight: 'bold',
                  alignSelf: 'center',
                  marginTop: 5,
                }}
              >
                Đặt lịch
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.form}>
          <View style={styles.title}>
            <Text style={textStyles.title}>Dịch vụ Spa cho mèo</Text>
            <Image source={require('../../assets/dog&cat2.png')} />
          </View>
          <View style={styles.title}>
            <Text
              style={{
                fontSize: 17,
                color: '#000',
                alignSelf: 'center',
                marginRight: 10,
              }}
            >
              140.000đ - 570.000đ
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('BookingSpaScreen')}
            >
              <Text
                style={{
                  color: '#005DB4',
                  fontSize: 18,
                  fontWeight: 'bold',
                  alignSelf: 'center',
                  marginTop: 5,
                }}
              >
                Đặt lịch
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ margin: 15 }}>
          <View style={{ flexDirection: 'row' }}>
            <Image
              source={require('../../assets/notespa.jpg')}
              style={{ width: 91, height: 91 }}
            />
            <View
              style={{
                backgroundColor: '#BAE6FD',
                paddingLeft: 10,
                paddingTop: 10,
                marginTop: 54,
                paddingRight: 13,
              }}
            >
              <Text style={textStyles.bold}>
                LƯU Ý KHI SỬ DỤNG DỊCH VỤ SPA PET
              </Text>
            </View>
          </View>
          <View style={{ backgroundColor: '#BAE6FD', padding: 8 }}>
            <Text style={textStyles.normal}>
              - Purr Pet không tiếp nhận vật nuôi đang mang thai, đang điều trị
              bệnh, mới phẫu thuật, có tiểu sử bệnh hen, co giật hoặc các bệnh
              lý khác khiến thú nuôi không có khả năng tự chủ.
            </Text>
            <Text style={textStyles.normal}>
              - Để đảm bảo an toàn cho sức khỏe khi đưa đến làm dịch vụ spa thú
              cưng: Không để thú cưng quá đói, hoặc ăn quá no và chạy nhảy quá
              sức trước khi đến cửa hàng. Có kế hoạch che nắng mưa trước khi đến
              và sau khi về. Nếu thú cưng có những biểu hiện bất thường về sức
              khỏe xin vui lòng liên hệ Purr Pet để được trợ giúp.
            </Text>
            <Text style={textStyles.normal}>
              - Vui lòng kiểm tra kỹ thú cưng khi đến đón thú cưng sau khi làm
              dịch vụ. Quy trình này đảm bảo nhân viên của Purr Pet đã thực hiện
              đúng yêu cầu và bạn hài lòng với chất lượng dịch vụ.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBCFE8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 90,
    padding: 10,
  },
  text: {
    fontSize: 18,
    color: '#000000',
    fontWeight: 'bold',
  },
  icon: {
    alignSelf: 'center',
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    padding: 20,
    backgroundColor: '#fff',
  },
  service: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  form: {
    marginTop: 40,
    margin: 10,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  button: {
    marginTop: 10,
    width: '50%',
    borderColor: '#005DB4',
    borderWidth: 1,
    borderRadius: 5,
    height: 40,
  },
});
export default SpaScreen;
