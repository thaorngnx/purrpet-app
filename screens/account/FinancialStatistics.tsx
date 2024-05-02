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
      <View style={viewStyles.card}>
        <Text style={textStyles.labelCenter}>Tổng chi tiêu </Text>
        <View style={viewStyles.flexRow}>
          <Text style={textStyles.label}>Đơn hàng: </Text>
          <Text
            style={[
              textStyles.normal,
              {
                flex: 1,
              },
            ]}
          >
            {formatCurrency(type.order)}
          </Text>
          <Text
            style={[
              textStyles.normal,
              {
                flex: 1,
              },
            ]}
          >
            {quantity.order} đơn
          </Text>
        </View>
        <View style={[viewStyles.flexRow]}>
          <Text style={textStyles.label}>Đặt lịch spa: </Text>
          <Text
            style={[
              textStyles.normal,
              {
                flex: 1,
              },
            ]}
          >
            {formatCurrency(type.spa)}
          </Text>
          <Text
            style={[
              textStyles.normal,
              {
                flex: 1,
              },
            ]}
          >
            {quantity.spa} đơn
          </Text>
        </View>
        <View style={viewStyles.flexRow}>
          <Text style={textStyles.label}>Đặt phòng homestay: </Text>
          <Text
            style={[
              textStyles.normal,
              {
                flex: 1,
              },
            ]}
          >
            {formatCurrency(type.homestay)}
          </Text>
          <Text
            style={[
              textStyles.normal,
              {
                flex: 1,
              },
            ]}
          >
            {quantity.homestay} đơn
          </Text>
        </View>
        <View style={[viewStyles.flexRow, { marginTop: 10 }]}>
          <Text style={textStyles.label}>Tổng cộng: </Text>
          <Text style={textStyles.normal}>
            {formatCurrency(type.homestay + type.order + type.spa)}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default FinancialStatistics;
