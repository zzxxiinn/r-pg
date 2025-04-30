import { View, Text } from 'react-native';
import React from 'react';

type RecordCardProps = {
  id: number;
  title: string;
  amount: number;
  createdAt: string;
};

const RecordCard = ({ record }: { record: RecordCardProps }) => {
  return (
    <View
      style={{
        padding: 16,
        marginTop: 12,
        borderRadius: 8,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.0,
        elevation: 1,
      }}
    >
      <View className='flex-row justify-between items-center'>
        <Text className='text-lg font-semibold text-gray-800 flex-1'>
          {record.title}
        </Text>
        <Text
          className={`text-xl font-bold ${
            record.amount > 0 ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {record.amount}
        </Text>
      </View>
    </View>
  );
};

export default RecordCard;
