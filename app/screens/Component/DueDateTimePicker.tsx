import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface DateTimePickerProps {
  dueDate: Date | null;
  dueTime: Date | null;
  setDueDate: (date: Date) => void;
  setDueTime: (time: Date) => void;
}

const DueDateTimePicker: React.FC<DateTimePickerProps> = ({
  dueDate,
  dueTime,
  setDueDate,
  setDueTime,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  return (
    <View style={styles.row}>
      <View style={styles.column}>
        <Text style={styles.label}>Due Date</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
          <Text style={{ color: dueDate ? '#000' : '#999' }}>
            {dueDate ? dueDate.toDateString() : 'Select date'}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={dueDate || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
            minimumDate={new Date()}
            onChange={(event, selectedDate) => {
              setShowDatePicker(Platform.OS === 'ios');
              if (selectedDate) setDueDate(selectedDate);
            }}
          />
        )}
      </View>

      <View style={styles.column}>
        <Text style={styles.label}>Due Time</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowTimePicker(true)}>
          <Text style={{ color: dueTime ? '#000' : '#999' }}>
            {dueTime
              ? dueTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : 'Select time'}
          </Text>
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker
            value={dueTime || new Date()}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, selectedTime) => {
              setShowTimePicker(Platform.OS === 'ios');
              if (selectedTime) setDueTime(selectedTime);
            }}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  column: {
    flex: 1,
  },
  label: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    color: '#000',
    borderWidth: 1,
    borderColor: '#808080',
  },
});

export default DueDateTimePicker;
