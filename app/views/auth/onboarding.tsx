import { apiPut, LoginResponse } from '@/app/utils/interceptor';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';

const FACTORS = ['Breed', 'Temperament', 'Size', 'Cost', 'Other'];

export default function OnboardingScreen() {
    const { user, updateUser } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [description, setDescription] = useState('');
    const [profileImg, setProfileImg] = useState(user?.profile_img || '');
    const [instaLink, setInstaLink] = useState('');
    const [tiktokLink, setTiktokLink] = useState('');
    
    // Onboarding questions
    const [lookingForPuppy, setLookingForPuppy] = useState<string>('');
    const [importantFactor, setImportantFactor] = useState<string>('');
    const [otherFactor, setOtherFactor] = useState<string>('');
    
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const validateInputs = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!name.trim()) {
            newErrors.name = 'Name is required';
        } else if (name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        if (description.trim().length > 500) {
            newErrors.description = 'Description must be less than 500 characters';
        }

        if (instaLink && !instaLink.match(/^https?:\/\/(www\.)?instagram\.com\/.+/)) {
            newErrors.instaLink = 'Please enter a valid Instagram URL';
        }

        if (tiktokLink && !tiktokLink.match(/^https?:\/\/(www\.)?tiktok\.com\/.+/)) {
            newErrors.tiktokLink = 'Please enter a valid TikTok URL';
        }

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
                name: name.trim(),
                description: description.trim(),
                profile_img: profileImg,
                insta_link: instaLink.trim(),
                tiktok_link: tiktokLink.trim(),
                onboarding_questions: onboardingQuestions,
            };

            console.log('Submitting onboarding data:', updateData);

            const response = await apiPut<LoginResponse>('/user/', updateData);

            console.log('Onboarding successful:', response);
            
            // Update user context
            await updateUser(response);

            setIsSubmitted(true);

            Alert.alert(
                'Success!',
                'Your profile has been updated successfully.',
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

    if (isSubmitted) {
        return (
            <SafeAreaView style={styles.successContainer}>
                <Text style={styles.successTitle}>Welcome to PupUp! 🎉</Text>
                <Text style={styles.successSubtitle}>
                    Your profile is all set up and ready to go.
                </Text>
            </SafeAreaView>
        );
    }

    const setOnboardingComplete() {
        
    }

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
            <Text style={styles.label}>Are you looking for a puppy? *</Text>
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
            </View>
            {errors.lookingForPuppy ? (
              <Text style={styles.errorText}>{errors.lookingForPuppy}</Text>
            ) : null}
          </View>

          {/* Most important factor */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              What factor is most important to you when choosing a puppy? *
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

          {/* Other factor */}
          {importantFactor === 'Other' && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>If other, please let us know: *</Text>
              <TextInput
                placeholder="Enter your answer"
                value={otherFactor}
                onChangeText={(text) => {
                  setOtherFactor(text);
                  if (errors.otherFactor)
                    setErrors({ ...errors, otherFactor: '' });
                }}
                style={[styles.input, errors.otherFactor && styles.inputError]}
                editable={!isLoading}
                maxLength={100}
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
              <Text style={styles.submitButtonText}>Complete Setup</Text>
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
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 32,
        fontFamily: 'Recoleta',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'Roboto',
        color: '#666',
        textAlign: 'center',
        marginBottom: 32,
    },
    imageContainer: {
        alignSelf: 'center',
        marginBottom: 24,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    imagePlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#dbdbdb',
        borderStyle: 'dashed',
    },
    imagePlaceholderText: {
        fontSize: 40,
        color: '#999',
        fontFamily: 'Roboto',
    },
    imagePlaceholderSubtext: {
        fontSize: 12,
        color: '#999',
        fontFamily: 'Roboto',
        marginTop: 4,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontFamily: 'Figtree_600SemiBold',
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
    textArea: {
        height: 100,
        borderColor: '#dbdbdb',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingTop: 12,
        fontSize: 16,
        fontFamily: 'Roboto',
        textAlignVertical: 'top',
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
        fontSize: 24,
        fontFamily: 'Recoleta',
        marginTop: 16,
        marginBottom: 16,
        textAlign: 'center',
    },
    radioGroup: {
        flexDirection: 'row',
        gap: 12,
    },
    radioButton: {
        flex: 1,
        height: 50,
        borderColor: '#dbdbdb',
        borderWidth: 2,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    radioButtonSelected: {
        borderColor: '#152C70',
        backgroundColor: '#152C7010',
    },
    radioButtonText: {
        fontSize: 16,
        fontFamily: 'Figtree_600SemiBold',
        color: '#666',
    },
    radioButtonTextSelected: {
        color: '#152C70',
    },
    factorGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    factorButton: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderColor: '#dbdbdb',
        borderWidth: 2,
        borderRadius: 10,
        backgroundColor: '#fff',
    },
    factorButtonSelected: {
        borderColor: '#152C70',
        backgroundColor: '#152C7010',
    },
    factorButtonText: {
        fontSize: 14,
        fontFamily: 'Figtree_600SemiBold',
        color: '#666',
    },
    factorButtonTextSelected: {
        color: '#152C70',
    },
    submitButton: {
        height: 56,
        backgroundColor: '#152C70',
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
        fontFamily: 'Figtree_600SemiBold',
        color: '#fff',
    },
    successContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    successTitle: {
        fontSize: 32,
        fontFamily: 'Recoleta',
        marginBottom: 16,
        textAlign: 'center',
    },
    successSubtitle: {
        fontSize: 16,
        fontFamily: 'Roboto',
        color: '#666',
        textAlign: 'center',
    },
});