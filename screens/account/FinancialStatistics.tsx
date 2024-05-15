import React from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import viewStyles from '../styles/ViewStyles';
import textStyles from '../styles/TextStyles';
import { useCustomerStore } from '../../zustand/customerStore';
import { useEffect } from 'react';
import { Statistics } from '../../api/pay';
import { formatCurrency } from '../../utils/formatData';
import { ArrowLeftIcon } from '@gluestack-ui/themed';

const FinancialStatistics = ({ navigation }: any) => {
  const customer = useCustomerStore((state) => state.customerState.data);
  const [type, setType] = React.useState({
    order: 0,
    spa: 0,
    homestay: 0,
  });
  const [quantity, setQuantity] = React.useState({
    order: 0,
    spa: 0,
    homestay: 0,
  });
  useEffect(() => {
    Statistics({}).then((res) => {
      setType({
        order: res.data.totalOrder,
        spa: res.data.totalBookingSpa,
        homestay: res.data.totalBookingHome,
      });
      setQuantity({
        order: res.data.quantityOrder,
        spa: res.data.quantityBookingSpa,
        homestay: res.data.quantityBookingHome,
      });
    });
  }, []);

  return (
    <SafeAreaView style={viewStyles.container}>
      <View style={viewStyles.titlePageBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeftIcon />
        </TouchableOpacity>
        <Text style={textStyles.title}>Thống kê</Text>
      </View>
      <View style={viewStyles.card}>
        <View style={viewStyles.flexRow}>
          <Text style={textStyles.label}>Khách hàng: </Text>
          <Text
            style={[
              textStyles.normal,
              {
                flex: 1,
              },
            ]}
          >
            {customer.name}
          </Text>
        </View>
        <View style={viewStyles.flexRow}>
          <Text style={textStyles.label}>Điểm tích luỹ: </Text>
          <Text style={textStyles.normal}>{customer.point}</Text>
        </View>
      </View>
      <View>
        <Text style={[textStyles.labelCenter, { marginTop: 10 }]}>
          Tổng chi tiêu đơn hàng{' '}
        </Text>
        <View style={[viewStyles.flexRow]}>
          <View style={[viewStyles.card, { width: '43%' }]}>
            <Text style={textStyles.label}>Tổng chi tiêu: </Text>
            <Text style={[textStyles.normal, { marginTop: 5 }]}>
              {formatCurrency(type.order)}
            </Text>
          </View>
          <View style={[viewStyles.card, { width: '43%' }]}>
            <Text style={[textStyles.label]}>Tổng đơn hàng:</Text>
            <Text style={[textStyles.normal, { marginTop: 5 }]}>
              {quantity.order} đơn
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('OrderHistoryScreen')}
              style={{ alignItems: 'flex-end', marginTop: 10 }}
            >
              <Text style={[textStyles.hintBoldItalic, { color: '#265F77' }]}>
                Danh sách đơn
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View>
        <Text style={[textStyles.labelCenter, { marginTop: 10 }]}>
          Tổng chi tiêu đơn đặt lịch spa{' '}
        </Text>
        <View style={[viewStyles.flexRow]}>
          <View style={[viewStyles.card, { width: '43%' }]}>
            <Text style={textStyles.label}>Tổng chi tiêu: </Text>
            <Text style={[textStyles.normal, { marginTop: 5 }]}>
              {formatCurrency(type.spa)}
            </Text>
          </View>
          <View style={[viewStyles.card, { width: '43%' }]}>
            <Text style={[textStyles.label]}>Tổng số đơn đặt lịch:</Text>
            <Text style={[textStyles.normal, { marginTop: 5 }]}>
              {quantity.spa} đơn
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('SpaHistoryScreen')}
              style={{ alignItems: 'flex-end', marginTop: 10 }}
            >
              <Text style={[textStyles.hintBoldItalic, { color: '#265F77' }]}>
                Danh sách đơn
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View>
        <Text style={[textStyles.labelCenter, { marginTop: 10 }]}>
          Tổng chi tiêu đơn đặt lịch homestay{' '}
        </Text>
        <View style={viewStyles.flexRow}>
          <View style={[viewStyles.card, { width: '43%' }]}>
            <Text style={textStyles.label}>Tổng chi tiêu: </Text>
            <Text style={[textStyles.normal, { marginTop: 5 }]}>
              {formatCurrency(type.homestay)}
            </Text>
          </View>
          <View style={[viewStyles.card, { width: '43%' }]}>
            <Text style={[textStyles.label]}>Tổng số đơn đặt phòng:</Text>
            <Text style={[textStyles.normal, { marginTop: 5 }]}>
              {quantity.homestay} đơn
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('HomestayHistoryScreen')}
              style={{ alignItems: 'flex-end', marginTop: 10 }}
            >
              <Text style={[textStyles.hintBoldItalic, { color: '#265F77' }]}>
                Danh sách đơn
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={[viewStyles.flexRow, { margin: 10 }]}>
        <Text style={textStyles.label}>Tổng cộng: </Text>
        <Text style={[textStyles.normal, { color: 'red' }]}>
          {formatCurrency(type.homestay + type.order + type.spa)}
        </Text>
      </View>
    </SafeAreaView>
  );
};
export default FinancialStatistics;
