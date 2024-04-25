import { StyleSheet } from 'react-native';

const buttonStyles = StyleSheet.create({
  buttonWrapper: {
    width: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#60A5FA',
    padding: 8,
    borderRadius: 5,
    marginTop: 10,
    width: 'auto',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 18,
    width: 'auto',
  },
  colorOutlineCard: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 12,
    margin: 10,
    width: 'auto',
    borderWidth: 1,
    borderColor: '#60A5FA',
    flexDirection: 'row',
  },
  buttonOutline: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#60A5FA',
    padding: 8,
    borderRadius: 5,
    marginTop: 10,
    width: 'auto',
  },
  buttonIncrease: {
    backgroundColor: '#F9A8D4',
    padding: 8,
    borderRadius: 13,
    width: 40,
  },
  buttonConfirm: {
    backgroundColor: '#ed77ac',
    padding: 8,
    borderRadius: 5,
    marginTop: 10,
    width: 'auto',
  },
  disabledButtonOutline: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'white',
    padding: 8,
    borderRadius: 5,
    marginTop: 10,
    width: 'auto',
    opacity: 0.5,
  },
});

export default buttonStyles;
