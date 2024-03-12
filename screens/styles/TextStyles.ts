import { StyleSheet } from 'react-native';

const textStyles = StyleSheet.create({
  normal: {
    color: 'black',
    fontSize: 14,
  },
  bold: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
  },
  label: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 5,
  },
  miniLabel: {
    color: 'black',
    fontSize: 12,
    marginBottom: 5,
  },
  title: {
    color: '#A16207',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    marginVertical: 5,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  hint: {
    color: 'black',
    fontSize: 12,
    textAlign: 'center',
  },
  hintBold: {
    color: 'black',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  hintBoldItalic: {
    color: 'black',
    fontSize: 12,
    fontWeight: 'bold',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  error: {
    color: 'red',
    fontSize: 12,
    textAlign: 'center',
  },
  labelCenter: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 17,
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default textStyles;
