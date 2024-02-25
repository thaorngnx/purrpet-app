import { Text, View } from "react-native";

interface LabelFormInputProps {
    text: string;
}
const LabelFormInput = ({text}: LabelFormInputProps) => {
    return (
        <View style={{marginVertical: 10}}>
            <Text style={{
                color: 'black',
                fontWeight: 'bold',
                fontSize: 14
            }}>
                {text}
            </Text>
        </View>
    );
}

export default LabelFormInput;