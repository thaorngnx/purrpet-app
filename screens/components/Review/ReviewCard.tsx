import { SafeAreaView, Text, View } from 'react-native';
import viewStyles from '../../styles/ViewStyles';
import { Review } from '../../../interface/Product';
import textStyles from '../../styles/TextStyles';
import { Star } from 'lucide-react-native';
import { v4 as uuidv4 } from 'uuid';
import { formatDateTime } from '../../../utils/formatData';

const ReviewCard = ({ review }: { review: Review }) => {
  return (
    <SafeAreaView>
      <View
        key={uuidv4()}
        style={{
          marginTop: 10,
        }}
      >
        <Text style={textStyles.bold}>{review.user?.name}</Text>
        <View style={viewStyles.flexRow}>
          {[...Array(5)].map((star, index) => {
            return (
              <Star
                key={index}
                size={15}
                fill={index < (review.rating as number) ? '#FFD700' : '#C0C0C0'}
                className='mr-1 my-2'
              />
            );
          })}
        </View>
        <Text style={textStyles.normal}>{review.comment}</Text>
        <Text
          style={[
            textStyles.hint,
            {
              marginTop: 5,
              textAlign: 'left',
            },
          ]}
        >
          {formatDateTime(review.createdAt)}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default ReviewCard;
