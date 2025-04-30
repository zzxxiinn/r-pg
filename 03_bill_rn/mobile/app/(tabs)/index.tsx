import { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, Pressable, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import RecordCard from '@/components/RecordCard';
import { create } from 'zustand';
import axios from 'axios';
import { useAuth } from '../_layout';
import { Session } from '@supabase/supabase-js';

type Record = {
  id: number;
  title: string;
  amount: number;
  createdAt: string;
};

type RecordStore = {
  records: Record[];
  fetchRecord: (date: Date, session: Session) => void;
};

export const useRecord = create<RecordStore>((set) => ({
  records: [],
  fetchRecord: (date, session) => {
    if (!session?.user?.id) {
      return;
    }
    axios
      .post(`${process.env.EXPO_PUBLIC_API_URL}/records`, {
        user_id: session.user.id,
        date: date.toISOString().split('T')[0],
      })
      .then(({ data }) => {
        console.log('res.data ->', data);

        // 读取到结果之后，去修改全局的 record
        set({ records: data as Record[] });
      });
  },
}));

export default function HomeScreen() {
  const session = useAuth((state) => state.session);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const records = useRecord((state) => state.records);
  const fetchRecord = useRecord((state) => state.fetchRecord);

  useEffect(() => {
    if (session?.user?.id) {
      fetchRecord(date, session);
    }
  }, [date]);

  return (
    <SafeAreaView className='flex-1 flex gap-4 mx-4'>
      {/* date */}
      <View className='flex flex-row justify-between'>
        <Text className='font-bold'>{date.toLocaleDateString()}</Text>
        <Pressable
          onPress={() => {
            setShowDatePicker(true);
          }}
        >
          <Text className='text-gray-500'>选择日期</Text>
        </Pressable>
      </View>
      {/* date picker */}
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode='date'
          display='inline'
          onChange={(event, selectedDate) => {
            if (selectedDate) {
              setDate(selectedDate);
              setShowDatePicker(false);
            }
          }}
        />
      )}
      {/* income and expense */}
      <View className='h-1/8 flex flex-row justify-between gap-2'>
        <View className='flex flex-1 bg-green-50 rounded-lg p-4 items-center justify-center'>
          <View className='w-full flex flex-row justify-between'>
            <Text className='font-bold'>收入</Text>
            <Text className='text-green-500'>
              {records
                .filter((record) => record.amount > 0)
                .reduce((acc, record) => acc + record.amount, 0)}
            </Text>
          </View>
        </View>

        <View className='flex flex-1 bg-red-50 rounded-lg p-4 items-center justify-center'>
          <View className='w-full flex flex-row justify-between'>
            <Text className='font-bold'>支出</Text>
            <Text className='text-red-500'>
              {records
                .filter((record) => record.amount < 0)
                .reduce((acc, record) => acc + record.amount, 0)}
            </Text>
          </View>
        </View>
      </View>

      {/* 详细记录 */}
      <View className='flex-1 bg-gray-100 rounded-lg py-4 gap-2'>
        <Text className='text-gray-500'>详细记录</Text>
        <ScrollView className='flex-1'>
          {/* <RecordCard
            record={{
              id: 1,
              title: '收入',
              amount: 1000,
              createdAt: '2021-01-01',
            }}
          /> */}
          {records.map((record) => (
            <RecordCard key={record.id} record={record} />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
