import {
  Icon,
  ChevronLeftIcon,
  RadioGroup,
  RadioIcon,
  CircleIcon,
  Radio,
  RadioIndicator,
  RadioLabel,
} from '@gluestack-ui/themed';
import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import textStyles from '../styles/TextStyles';
import textInputStyles from '../styles/TextInputStyles';

const BookingHomeScreen = ({ navigation }: any) => {
  const [values, setValues] = React.useState('Dog');
  return (
    <SafeAreaView>
      <View
        style={{
          backgroundColor: '#FDE047',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 50,
          paddingRight: 100,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon as={ChevronLeftIcon} size='xl' color='#B91C1C' />
        </TouchableOpacity>
        <Text style={textStyles.title}>Thông tin đặt phòng</Text>
      </View>
      <View>
        <Text style={textStyles.labelCenter}>Thông tin thú cưng</Text>
        <TextInput
          placeholder='Tên thú cưng'
          style={textInputStyles.textInputBorder}
        />
        <Text style={textStyles.label}>Thú cưng là:</Text>
        <RadioGroup value={values} onChange={setValues}>
          <Radio value='Dog' size='md'>
            <RadioIndicator mr='$2'>
              <RadioIcon as={CircleIcon} />
            </RadioIndicator>
            <RadioLabel>Chó</RadioLabel>
          </Radio>
          <Radio value='Cat' size='md'>
            <RadioIndicator mr='$2'>
              <RadioIcon as={CircleIcon} />
            </RadioIndicator>
            <RadioLabel>Mèo</RadioLabel>
          </Radio>
        </RadioGroup>
      </View>
    </SafeAreaView>
  );
};
export default BookingHomeScreen;
