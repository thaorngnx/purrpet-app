import React, { useEffect } from 'react';
import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import viewStyles from '../styles/ViewStyles';
import textStyles from '../styles/TextStyles';
import { useCustomerStore } from '../../zustand/customerStore';
import { ArrowLeftIcon, Info } from 'lucide-react-native';
import {
  formatCurrency,
  formatDateTime,
  formatNumber,
} from '../../utils/formatData';
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Icon,
  CloseIcon,
  ModalFooter,
  ButtonText,
  Button,
} from '@gluestack-ui/themed';
import { getCoins } from '../../api/coin';
import { Image } from 'react-native';

export const CoinWalletScreen = ({ navigation }: any) => {
  const [showHelp, setShowHelp] = React.useState(false);
  const ref = React.useRef(null);
  const [coinInfo, setCoinInfo] = React.useState({} as any);
  const [tabCoin, setTabCoin] = React.useState(0);
  const customer = useCustomerStore((state) => state.customerState.data);

  useEffect(() => {
    getCoins().then((res) => {
      if (res.err === 0) {
        setCoinInfo(res.data);
      }
    });
  }, [coinInfo]);
  let coins = {} as any;
  if (tabCoin === 0) {
    coins = coinInfo;
  } else if (tabCoin === 1) {
    coins = coinInfo.filter((coin: any) => coin.status === 'cộng');
  } else {
    coins = coinInfo.filter((coin: any) => coin.status === 'trừ');
  }

  return (
    <SafeAreaView style={viewStyles.container}>
      <View style={viewStyles.titlePageBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeftIcon color='#2851a4' />
        </TouchableOpacity>
        <Text style={textStyles.title}>Ví Xu</Text>
      </View>
      <View style={viewStyles.card}>
        <View
          style={[
            viewStyles.flexRow,
            { alignItems: 'flex-end', marginBottom: 10 },
          ]}
        >
          <Text
            style={[
              textStyles.normal,
              { fontSize: 26, color: '#f6a700', marginRight: 5 },
            ]}
          >
            {formatNumber(customer.coin)}
          </Text>
          <Text
            style={[
              textStyles.normal,
              { fontSize: 14, color: '#f6a700', marginRight: 5 },
            ]}
          >
            Xu khả dụng
          </Text>
          <TouchableOpacity onPress={() => setShowHelp(!showHelp)}>
            <Info size={16} color='#000000' />
          </TouchableOpacity>
        </View>
        <Text style={textStyles.miniLabel}>
          Đồng nghĩa bạn có thể sử dụng {formatCurrency(customer.coin)} để mua
          sản phẩm hoặc dịch vụ tại cửa hàng.
        </Text>
        <Modal
          isOpen={showHelp}
          onClose={() => {
            setShowHelp(false);
          }}
          finalFocusRef={ref}
        >
          <ModalBackdrop />
          <ModalContent>
            <ModalHeader>
              <Text style={[textStyles.title, { color: '#f6a700' }]}>
                Xu trong ví của bạn
              </Text>
              <ModalCloseButton>
                <Icon as={CloseIcon} />
              </ModalCloseButton>
            </ModalHeader>
            <ModalBody>
              <Text style={textStyles.normal}>
                Đây là số dư Xu của bạn. Có được khi bạn huỷ các đơn hàng đã
                thanh toán. Bạn có thể sử dụng nó để thanh toán các đơn hàng
                sau!
              </Text>
            </ModalBody>
            <ModalFooter>
              <Button
                variant='outline'
                size='sm'
                action='secondary'
                mr='$3'
                onPress={() => {
                  setShowHelp(false);
                }}
              >
                <ButtonText>Đóng</ButtonText>
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </View>

      <View>
        <FlatList
          horizontal
          data={['Tất cả', 'Đã nhận', 'Đã dùng']}
          keyExtractor={(item) => item.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              key={index}
              style={[
                viewStyles.tab,
                tabCoin === index && viewStyles.activeTab,
                { width: 'auto', marginLeft: 30 },
              ]}
              onPress={() => setTabCoin(index)}
            >
              <Text style={viewStyles.tabText}>{item.toString()}</Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
          key={tabCoin}
        />
        {coins.length > 0 ? (
          <FlatList
            data={coins}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => (
              <View style={[viewStyles.boxUnderline]}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '95%',
                  }}
                >
                  <Image
                    source={
                      item.status === 'cộng'
                        ? require('../../assets/coin.png')
                        : require('../../assets/Remove-bg.ai_1715610157596.png')
                    }
                    style={{ width: 30, height: 30 }}
                  />

                  <View style={{ marginLeft: 10, width: '70%' }}>
                    <Text style={[textStyles.normal]}>
                      {item.status === 'cộng'
                        ? `Bạn được cộng ${formatNumber(
                            item?.coin,
                          )} xu vì huỷ đơn hàng đã thanh toán cho đơn hàng ${
                            item?.orderCode
                          }`
                        : `Bạn đã dùng ${formatNumber(
                            item?.coin,
                          )} xu để thanh toán cho đơn hàng ${item?.orderCode}`}
                    </Text>
                    <Text style={textStyles.miniLabel}>
                      {formatDateTime(item.createdAt)}
                    </Text>
                  </View>
                  <Text
                    style={[
                      textStyles.normal,
                      {
                        color: item.status === 'cộng' ? '#f6a700' : '#000000',
                        fontSize: 20,
                      },
                    ]}
                    className='mr-1'
                  >
                    {item.status === 'cộng'
                      ? `+ ${formatNumber(item?.coin)}`
                      : `- ${formatNumber(item?.coin)}`}
                  </Text>
                </View>
              </View>
            )}
          />
        ) : (
          <View className='m-[auto]'>
            <Text style={textStyles.label}>Chưa có dữ liệu</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};
