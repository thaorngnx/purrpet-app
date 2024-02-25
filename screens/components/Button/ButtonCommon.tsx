import { Button } from "react-native";

interface ButtonCommonProps {
    title: string;
    onPress: () => void;
}
const ButtonCommon = ({title, onPress}: ButtonCommonProps) => {
    return (
        <Button 
            title={title}
            color="black"
            onPress={onPress}
        />
    );
}

export default ButtonCommon;