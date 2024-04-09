import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronRightIcon,
  Tabs,
} from '@gluestack-ui/themed';
import textStyles from '../../styles/TextStyles';
import viewStyles from '../../styles/ViewStyles';
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { useEffect, useState } from 'react';
import { getBookingSpas } from '../../../api/bookingSpa';
import { BookingSpa, BookingSpaResponse } from '../../../interface/BookingSpa';
import * as CONST from '../../constants';
import { ScrollView } from 'react-native';
import { formatCurrency, formatDateTime } from '../../../utils/formatData';
import { useCustomerStore } from '../../../zustand/customerStore';

const SpaHistoryScreen = ({ navigation }: any) => {
  const customerState = useCustomerStore((state) => state.customerState);
  const [resBSpas, setResBSpas] = useState({} as BookingSpaResponse);
  const [tabSpa, setTabSpa] = useState(0);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const params = {
      // limit: 10,
      // page: page,
      // key: categoryCode || searchKey,
      // spa: sort,
    };
    //api get spa
    getBookingSpas(params).then((res) => {
      if (res.err === 0) {
        setResBSpas(res);
      }

      //
    });
  }, []); //page

  const bSpas = resBSpas.data;
  let totalPage = resBSpas.totalPage;

  let bSpaByStatus = [];

  if (tabSpa === 0) {
    bSpaByStatus = bSpas;
  } else {
    const status = Object.values(CONST.STATUS_BOOKING)[tabSpa - 1];
    bSpaByStatus = bSpas?.filter((bSpa) => bSpa.status === status) || [];
  }

  // const handleChangePage = (event, value) => {
  //   setPage(value);
  // };

  return (
    <>
      <SafeAreaView style={viewStyles.container}>
        <View style={viewStyles.titlePageBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeftIcon />
          </TouchableOpacity>
          <Text style={textStyles.title}>Lịch sử đặt lịch spa</Text>
        </View>
        <View>
          {/* <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={viewStyles.tabContainer}
            key={tabSpa}
          >
            <TouchableOpacity
              key={0}
              style={[viewStyles.tab, tabSpa === 0 && viewStyles.activeTab]}
              onPress={() => setTabSpa(0)}
            >
              <Text style={viewStyles.tabText}>Tất cả</Text>
            </TouchableOpacity>
            {Object.values(CONST.STATUS_BOOKING).map((status, index) => (
              <TouchableOpacity
                key={index + 1}
                style={[
                  viewStyles.tab,
                  tabSpa === index + 1 && viewStyles.activeTab,
                ]}
                onPress={() => setTabSpa(index + 1)}
              >
                <Text style={viewStyles.tabText}>{status}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView> */}
          <FlatList
            horizontal
            data={['Tất cả', ...Object.values(CONST.STATUS_BOOKING)]}
            keyExtractor={(item) => item}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                key={index}
                style={[
                  viewStyles.tab,
                  tabSpa === index && viewStyles.activeTab,
                ]}
                onPress={() => setTabSpa(index)}
              >
                <Text style={viewStyles.tabText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
        {bSpaByStatus?.length > 0 ? (
          <FlatList
            data={bSpaByStatus}
            keyExtractor={(item) => item.purrPetCode}
            renderItem={({ item }) => (
              <View style={viewStyles.orderCard}>
                <View style={viewStyles.flexRow} className='justify-between'>
                  <View style={viewStyles.flexRow}>
                    <Text style={textStyles.label} className='mr-1'>
                      Ngày đặt:
                    </Text>
                    <Text style={textStyles.normal}>
                      {formatDateTime(item.createdAt)}
                    </Text>
                  </View>
                  <View style={viewStyles.flexRow}>
                    <Text style={textStyles.label} className='mr-1'>
                      Trạng thái:
                    </Text>
                    <Text style={textStyles.normal}>{item.status}</Text>
                  </View>
                </View>
                <View style={viewStyles.flexRow} className='justify-between'>
                  <Text style={textStyles.hint}>
                    Mã đơn hàng: {item.purrPetCode}
                  </Text>
                  <Text style={textStyles.hint}>
                    Tổng tiền: {formatCurrency(item.bookingSpaPrice)}
                  </Text>
                </View>
                <View style={viewStyles.colorCard}>
                  <View style={viewStyles.flexRow} className='items-center'>
                    <Text style={textStyles.label} className='m-1'>
                      Tên thú cưng:
                    </Text>
                    <Text style={textStyles.normal}>{item.petName}</Text>
                  </View>
                  <View style={viewStyles.flexRow} className='items-center'>
                    <Text style={textStyles.label} className='m-1'>
                      Ngày hẹn:
                    </Text>
                    <Text style={textStyles.normal}>
                      {formatDateTime(item.bookingDate)}
                      {' - '}
                      {item.bookingTime}
                    </Text>
                  </View>
                  <View style={viewStyles.flexRow} className='items-center'>
                    <Text style={textStyles.label} className='m-1'>
                      Mã dịch vụ:
                    </Text>
                    <Text style={textStyles.normal}>{item.spaCode}</Text>
                  </View>
                </View>
                <View style={viewStyles.flexRow} className='justify-end'>
                  <TouchableOpacity
                    style={viewStyles.flexRow}
                    onPress={() =>
                      navigation.navigate('BookingSpaDetailScreen', {
                        bookingSpaCode: item.purrPetCode,
                      })
                    }
                  >
                    <Text className='mr-1 text-[#A16207]'>Xem chi tiết</Text>
                    <ChevronRightIcon color='#A16207' />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        ) : (
          <View style={viewStyles.orderCard}>
            <Text style={textStyles.normal}>
              Không có đơn đặt lịch nào ở trạng thái này
            </Text>
          </View>
        )}
      </SafeAreaView>
    </>
  );
};

export default SpaHistoryScreen;
