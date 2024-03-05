import { StyleSheet } from 'react-native';

const textStyles = StyleSheet.create({
  label: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 5,
  },
  title: {
    color: '#A16207',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    marginVertical: 5,
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
    fontSize: 14,
    marginBottom: 5,
    marginTop: 5,
    textAlign: 'center',
  },
});

export default textStyles;
