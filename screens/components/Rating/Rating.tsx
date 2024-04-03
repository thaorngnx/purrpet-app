import { Star } from 'lucide-react-native';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';

//componet xú lý đánh giá sao và bình luận
const Rating = () => {
  const stars = [];
  const totalStars = 5;
  return (
    <View>
      <View style={{ flexDirection: 'row', marginTop: 10 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black' }}>
          Đánh giá sao
        </Text>
      </View>
      <View style={{ flexDirection: 'row', marginTop: 10 }}>
        {[...Array(totalStars)].map((star, index) => {
          return (
            <TouchableOpacity key={index}>
              <Star size={30} color={index < 2 ? '#FFD700' : '#C0C0C0'} />
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={{ marginTop: 10 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black' }}>
          Bình luận
        </Text>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: 'gray',
            marginTop: 10,
            borderRadius: 5,
            padding: 10,
          }}
          multiline
          numberOfLines={4}
        />
      </View>
    </View>
  );
};

export default Rating;
