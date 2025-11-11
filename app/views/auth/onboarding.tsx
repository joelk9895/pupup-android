import { apiPut, LoginResponse } from '@/app/utils/interceptor';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';

const FACTORS = ['Breed', 'Temperament', 'Cost', 'Other'];

export default function OnboardingScreen() {
  const { user, updateUser, setOnboardingComplete } = useAuth();

  // Onboarding questions
  const [lookingForPuppy, setLookingForPuppy] = useState<string>('');
  const [importantFactor, setImportantFactor] = useState<string>('');
  const [otherFactor, setOtherFactor] = useState<string>('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateInputs = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!lookingForPuppy) {
      newErrors.lookingForPuppy = 'Please select if you are looking for a puppy';
    }

    if (!importantFactor) {
      newErrors.importantFactor = 'Please select the most important factor';
    }

    if (importantFactor === 'Other' && !otherFactor.trim()) {
      newErrors.otherFactor = 'Please specify the other factor';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);

    try {
      const onboardingQuestions = {
        looking: lookingForPuppy,
        factor: importantFactor,
        other: importantFactor === 'Other' ? otherFactor : '',
      };

      const updateData = {
        onboarding_questions: onboardingQuestions,
      };


      const response = await apiPut<LoginResponse>('/user/', updateData);


      // Update user context
      await updateUser(response);

      // Mark onboarding as complete
      await setOnboardingComplete();

      Alert.alert(
        'Success!',
        'Welcome to PupUp! Your profile is all set.',
        [{ text: 'OK', style: 'default' }]
      );
    } catch (error: any) {
      console.error('Error submitting onboarding:', error);

      let errorMessage = 'Failed to update profile. Please try again.';

      if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert('Error', errorMessage, [{ text: 'OK', style: 'default' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <Text style={styles.sectionTitle}>Quick Questions</Text>
            {/* Are you looking for a puppy? */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Are you looking for a puppy?</Text>
              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    lookingForPuppy === 'Yes' && styles.radioButtonSelected,
                  ]}
                  onPress={() => {
                    setLookingForPuppy('Yes');
                    if (errors.lookingForPuppy)
                      setErrors({ ...errors, lookingForPuppy: '' });
                  }}
                  disabled={isLoading}
                >
                  <Text
                    style={[
                      styles.radioButtonText,
                      lookingForPuppy === 'Yes' && styles.radioButtonTextSelected,
                    ]}
                  >
                    Yes
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    lookingForPuppy === 'No' && styles.radioButtonSelected,
                  ]}
                  onPress={() => {
                    setLookingForPuppy('No');
                    if (errors.lookingForPuppy)
                      setErrors({ ...errors, lookingForPuppy: '' });
                  }}
                  disabled={isLoading}
                >
                  <Text
                    style={[
                      styles.radioButtonText,
                      lookingForPuppy === 'No' && styles.radioButtonTextSelected,
                    ]}
                  >
                    No
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    lookingForPuppy === 'In the Future' && styles.radioButtonSelected,
                  ]}
                  onPress={() => {
                    setLookingForPuppy('In the Future');
                    if (errors.lookingForPuppy)
                      setErrors({ ...errors, lookingForPuppy: '' });
                  }}
                  disabled={isLoading}
                >
                  <Text
                    style={[
                      styles.radioButtonText,
                      lookingForPuppy === 'In the Future' && styles.radioButtonTextSelected,
                    ]}
                  >
                    In the Future
                  </Text>
                </TouchableOpacity>
              </View>
              {errors.lookingForPuppy ? (
                <Text style={styles.errorText}>{errors.lookingForPuppy}</Text>
              ) : null}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                What factor is most important to you when choosing a puppy?
              </Text>
              <View style={styles.factorGrid}>
                {FACTORS.map((factor) => (
                  <TouchableOpacity
                    key={factor}
                    style={[
                      styles.factorButton,
                      importantFactor === factor && styles.factorButtonSelected,
                    ]}
                    onPress={() => {
                      setImportantFactor(factor);
                      if (errors.importantFactor)
                        setErrors({ ...errors, importantFactor: '' });
                    }}
                    disabled={isLoading}
                  >
                    <Text
                      style={[
                        styles.factorButtonText,
                        importantFactor === factor &&
                        styles.factorButtonTextSelected,
                      ]}
                    >
                      {factor}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.importantFactor ? (
                <Text style={styles.errorText}>{errors.importantFactor}</Text>
              ) : null}
            </View>

            {importantFactor === 'Other' && (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>If other, please let us know:</Text>
                <TextInput
                  value={otherFactor}
                  onChangeText={(text) => {
                    setOtherFactor(text);
                    if (errors.otherFactor)
                      setErrors({ ...errors, otherFactor: '' });
                  }}
                  style={[styles.input, errors.otherFactor && styles.inputError, styles.multi]}
                  editable={!isLoading}
                  maxLength={100}
                  multiline
                />
                {errors.otherFactor ? (
                  <Text style={styles.errorText}>{errors.otherFactor}</Text>
                ) : null}
              </View>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>Submit</Text>
              )}
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Roboto',
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#dbdbdb',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    fontFamily: 'Roboto',
  },
  multi: {
    height: 80,
  },
  inputError: {
    borderColor: '#dc3545',
    borderWidth: 2,
  },
  errorText: {
    color: '#dc3545',
    fontSize: 12,
    fontFamily: 'Roboto',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 34,
    fontFamily: 'Recoleta',
    marginTop: 16,
    marginBottom: 16,
    textAlign: "left"
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  radioButton: {
    flex: 1,
    height: 41,
    borderColor: '#dbdbdb',
    borderWidth: 2,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  radioButtonSelected: {
    borderColor: '#007AFF',
  },
  radioButtonText: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Roboto',
    color: '#020617',
  },
  radioButtonTextSelected: {
  },
  factorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  factorButton: {
    width: '48%',
    height: 41,
    borderColor: '#dbdbdb',
    borderWidth: 2,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  factorButtonSelected: {
    borderColor: '#007AFF',
  },
  factorButtonText: {
    fontSize: 14,
    fontFamily: 'Roboto',
    fontWeight: '500',
    color: '#020617',
  },
  factorButtonTextSelected: {
    color: '#152C70',
  },
  submitButton: {
    height: 56,
    backgroundColor: '#000',
    borderRadius: 500,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    fontSize: 18,
    fontFamily: 'Roboto',
    fontWeight: '500',
    color: '#fff',
  },
});