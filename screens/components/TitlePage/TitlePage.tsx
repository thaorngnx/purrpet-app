import { Text, View } from "react-native";
interface TitlePageProps {
    text: string;
}
const TitlePage = ({text}: TitlePageProps) => {
    return (
        <View style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 10,
            marginBottom: 5,
        }}>
            <Text style={{
                color: 'black',
                fontSize: 20,
                fontWeight: 'bold',
                textAlign: 'center',
                textTransform: 'uppercase',
            }}>
                {text}
            </Text>
        </View>
    );
}
export default TitlePage;