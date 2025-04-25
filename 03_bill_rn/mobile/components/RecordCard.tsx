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
    <View className='bg-white p-4 mt-3 shadow-sm rounded-xl'>
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
