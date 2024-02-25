import { Text } from "react-native";

interface TextHintProps {
    text: string;
}
const TextHint = ({text}: TextHintProps) => {
    return (
        <Text style={{
            color: 'red',
            fontSize: 14,
            marginVertical: 10,
            fontStyle: 'italic',
        }}>
            {text}
        </Text>
    );
}

export default TextHint;