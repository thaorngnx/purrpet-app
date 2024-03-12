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
  colorOutlineCard: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 12,
    margin: 10,
    width: 'auto',
    borderWidth: 1,
    borderColor: '#A16207',
    flexDirection: 'row',
  },
  buttonOutline: {
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
  buttonConfirm: {
    backgroundColor: '#A16207',
    padding: 8,
    borderRadius: 5,
    marginTop: 10,
    width: 'auto',
  },
});

export default buttonStyles;
