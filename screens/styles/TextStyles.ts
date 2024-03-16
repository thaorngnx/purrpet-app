import { StyleSheet } from 'react-native';

const textStyles = StyleSheet.create({
  normal: {
    color: 'black',
    fontSize: 15,
  },
  bold: {
    color: 'black',
    fontSize: 15,
    fontWeight: 'bold',
  },
  label: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 15,
    marginRight: 3,
  },
  miniLabel: {
    color: 'black',
    fontSize: 13,
    marginBottom: 5,
  },
  title: {
    color: '#A16207',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    marginVertical: 5,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  hint: {
    color: 'black',
    fontSize: 13,
    textAlign: 'center',
  },
  hintBold: {
    color: 'black',
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  hintBoldItalic: {
    color: 'black',
    fontSize: 13,
    fontWeight: 'bold',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  error: {
    color: 'red',
    fontSize: 13,
    textAlign: 'center',
  },
  labelCenter: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default textStyles;
