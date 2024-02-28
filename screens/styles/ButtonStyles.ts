import { StyleSheet } from 'react-native';

const buttonStyles = StyleSheet.create({
  buttonWrapper: {
    width: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#A16207',
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
  buttomOutline: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#A16207',
    padding: 8,
    borderRadius: 5,
    marginTop: 10,
    width: 'auto',
  },
  buttonIncrease: {
    backgroundColor: '#A16207',
    padding: 8,
    borderRadius: 13,
    marginTop: 10,
    width: 40,
  },
});

export default buttonStyles;
