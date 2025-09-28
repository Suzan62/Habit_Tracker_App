import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../context/AuthContext';
import { habitAPI } from '../services/api';

const AddHabitScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Personal',
    type: 'Daily',
    targetCount: 1,
    unit: '',
    pointsReward: 10,
    reminderTime: null,
    daysOfWeek: [],
    isPublic: false,
  });

  const [showTimePicker, setShowTimePicker] = useState(false);

  const categories = [
    'Health', 'Fitness', 'Learning', 'Work',
    'Personal', 'Social', 'Creative', 'Financial', 'Other'
  ];

  const habitTypes = ['Daily', 'Weekly', 'Monthly'];

  const daysOfWeek = [
    { key: 'monday', label: 'Mon' },
    { key: 'tuesday', label: 'Tue' },
    { key: 'wednesday', label: 'Wed' },
    { key: 'thursday', label: 'Thu' },
    { key: 'friday', label: 'Fri' },
    { key: 'saturday', label: 'Sat' },
    { key: 'sunday', label: 'Sun' },
  ];

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleDay = (day) => {
    setFormData(prev => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(day)
        ? prev.daysOfWeek.filter(d => d !== day)
        : [...prev.daysOfWeek, day]
    }));
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      updateFormData('reminderTime', selectedTime);
    }
  };

  const formatTime = (time) => {
    if (!time) return 'Set reminder time';
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Habit name is required');
      return false;
    }

    if (formData.type === 'Weekly' && formData.daysOfWeek.length === 0) {
      Alert.alert('Error', 'Please select at least one day for weekly habits');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Convert category and type strings to match backend enums
      const habitData = {
        name: formData.name,
        description: formData.description || null,
        category: formData.category, // Backend should handle string to enum conversion
        type: formData.type, // Backend should handle string to enum conversion
        targetCount: formData.targetCount,
        unit: formData.unit || null,
        pointsReward: formData.pointsReward,
        reminderTime: formData.reminderTime 
          ? formData.reminderTime.toTimeString().slice(0, 8) // Full time format
          : null,
        daysOfWeek: formData.daysOfWeek.length > 0 
          ? JSON.stringify(formData.daysOfWeek) 
          : null,
        isActive: true,
        isPublic: formData.isPublic,
        // Don't send userId - backend will get it from JWT token
      };

      await habitAPI.createHabit(habitData);
      Alert.alert(
        'Success',
        'Habit created successfully!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Error creating habit:', error);
      console.error('Error details:', error.response?.data);
      console.error('Request data:', habitData);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          error.message || 
                          'Failed to create habit. Please try again.';
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Habit Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Drink 8 glasses of water"
              value={formData.name}
              onChangeText={(text) => updateFormData('name', text)}
              maxLength={200}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Optional description of your habit"
              value={formData.description}
              onChangeText={(text) => updateFormData('description', text)}
              maxLength={1000}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.category}
                  onValueChange={(value) => updateFormData('category', value)}
                  style={styles.picker}
                >
                  {categories.map(cat => (
                    <Picker.Item key={cat} label={cat} value={cat} />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.halfWidth}>
              <Text style={styles.label}>Frequency</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.type}
                  onValueChange={(value) => updateFormData('type', value)}
                  style={styles.picker}
                >
                  {habitTypes.map(type => (
                    <Picker.Item key={type} label={type} value={type} />
                  ))}
                </Picker>
              </View>
            </View>
          </View>
        </View>

        {/* Target & Measurement */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Target & Measurement</Text>
          
          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Text style={styles.label}>Target Count</Text>
              <TextInput
                style={styles.input}
                placeholder="1"
                value={String(formData.targetCount)}
                onChangeText={(text) => updateFormData('targetCount', parseInt(text) || 1)}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.halfWidth}>
              <Text style={styles.label}>Unit (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., glasses, minutes, pages"
                value={formData.unit}
                onChangeText={(text) => updateFormData('unit', text)}
                maxLength={50}
              />
            </View>
          </View>
        </View>

        {/* Schedule & Reminders */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Schedule & Reminders</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Reminder Time</Text>
            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={styles.timeButtonText}>
                {formatTime(formData.reminderTime)}
              </Text>
            </TouchableOpacity>
            <Text style={styles.helpText}>Set a time to receive daily reminders</Text>
          </View>

          {showTimePicker && (
            <DateTimePicker
              value={formData.reminderTime || new Date()}
              mode="time"
              is24Hour={false}
              display="default"
              onChange={handleTimeChange}
            />
          )}

          {formData.type === 'Weekly' && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Days of Week</Text>
              <View style={styles.daysContainer}>
                {daysOfWeek.map(day => (
                  <TouchableOpacity
                    key={day.key}
                    style={[
                      styles.dayButton,
                      formData.daysOfWeek.includes(day.key) && styles.dayButtonSelected
                    ]}
                    onPress={() => toggleDay(day.key)}
                  >
                    <Text style={[
                      styles.dayButtonText,
                      formData.daysOfWeek.includes(day.key) && styles.dayButtonTextSelected
                    ]}>
                      {day.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Text style={styles.label}>Points Reward</Text>
              <TextInput
                style={styles.input}
                placeholder="10"
                value={String(formData.pointsReward)}
                onChangeText={(text) => updateFormData('pointsReward', parseInt(text) || 10)}
                keyboardType="numeric"
              />
              <Text style={styles.helpText}>Points earned for each completion</Text>
            </View>

            <View style={styles.halfWidth}>
              <Text style={styles.label}>Privacy</Text>
              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Make public</Text>
                <Switch
                  value={formData.isPublic}
                  onValueChange={(value) => updateFormData('isPublic', value)}
                  trackColor={{ false: '#ccc', true: '#4CAF50' }}
                  thumbColor={formData.isPublic ? '#fff' : '#f4f3f4'}
                />
              </View>
              <Text style={styles.helpText}>Visible to friends</Text>
            </View>
          </View>
        </View>

        {/* Submit Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Creating...' : 'Create Habit'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  halfWidth: {
    flex: 1,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  timeButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  timeButtonText: {
    fontSize: 16,
    color: '#333',
  },
  helpText: {
    fontSize: 12,
    color: '#777',
    marginTop: 5,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  dayButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dayButtonSelected: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  dayButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  dayButtonTextSelected: {
    color: '#fff',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  switchLabel: {
    fontSize: 14,
    color: '#555',
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddHabitScreen;
