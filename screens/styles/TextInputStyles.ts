import { StyleSheet } from 'react-native';

const textInputStyles = StyleSheet.create({
  textInputBorder: {
    borderWidth: 1,
    borderColor: '#d3d3d3',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 15,
    color: 'black',
    fontSize: 14,
  },
  selectInput: {
    paddingVertical: 3,
    paddingHorizontal: 15,
    color: 'black',
    fontSize: 14,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 5,
    width: 50,
    textAlign: 'center',
    color: 'black',
  },
});

export default textInputStyles;
