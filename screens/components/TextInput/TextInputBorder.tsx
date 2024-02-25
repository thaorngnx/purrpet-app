import { TextInput } from 'react-native';

interface TextInputBorderProps {
    placeholderText: string;
}

const TextInputBorder = ({ placeholderText }: TextInputBorderProps) => {
    return (
        <TextInput 
            placeholder={placeholderText} 
            style={{ 
                borderWidth: 1,
                borderColor: 'black', 
                borderRadius: 5, 
                padding: 8 
            }} 
        />
    );
}

export default TextInputBorder;