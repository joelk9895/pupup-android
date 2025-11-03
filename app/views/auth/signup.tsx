import { apiPost } from '@/app/utils/interceptor';
import { RootStackParamList } from '@/app/views/auth/login';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
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

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'EnterEmail'>;
};

export default function EnterEmailScreenSignup({ navigation }: Props) {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [emailError, setEmailError] = useState('');
    const [nameError, setNameError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Email validation regex (RFC 5322 simplified)
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Name validation (2-50 characters, letters, spaces, hyphens, apostrophes)
    const validateName = (name: string): boolean => {
        const nameRegex = /^[a-zA-Z\s'-]{2,50}$/;
        return nameRegex.test(name.trim());
    };

    const handleEmailChange = (text: string) => {
        setEmail(text);
        if (emailError) {
            setEmailError('');
        }
    };

    const handleNameChange = (text: string) => {
        setName(text);
        if (nameError) {
            setNameError('');
        }
    };

    const validateInputs = (): boolean => {
        let isValid = true;

        // Validate name
        const trimmedName = name.trim();
        if (!trimmedName) {
            setNameError('Name is required');
            isValid = false;
        } else if (trimmedName.length < 2) {
            setNameError('Name must be at least 2 characters');
            isValid = false;
        } else if (trimmedName.length > 50) {
            setNameError('Name must be less than 50 characters');
            isValid = false;
        } else if (!validateName(trimmedName)) {
            setNameError('Name can only contain letters, spaces, hyphens, and apostrophes');
            isValid = false;
        }

        // Validate email
        const trimmedEmail = email.trim().toLowerCase();
        if (!trimmedEmail) {
            setEmailError('Email is required');
            isValid = false;
        } else if (!validateEmail(trimmedEmail)) {
            setEmailError('Please enter a valid email address');
            isValid = false;
        }

        return isValid;
    };

    const getOtp = async () => {
        // Clear previous errors
        setEmailError('');
        setNameError('');

        // Validate inputs
        if (!validateInputs()) {
            return;
        }

        setIsLoading(true);

        try {
            const response = await apiPost('/user/send_otp', {
                email: email.trim().toLowerCase()
            });

            console.log('OTP sent successfully:', response);
            navigation.navigate('EnterOtp', {
                email: email.trim().toLowerCase(),
                name: name.trim()
            });
        } catch (error: any) {
            console.error('Error sending OTP:', error);

            // Handle different error scenarios
            let errorMessage = 'Failed to send verification code. Please try again.';

            if (error.response) {
                // Server responded with error
                const status = error.response.status;
                const data = error.response.data;

                if (status === 400) {
                    errorMessage = data?.message || 'Invalid email or name format';
                } else if (status === 409) {
                    errorMessage = 'This email is already registered. Please sign in instead.';
                } else if (status === 429) {
                    errorMessage = 'Too many attempts. Please try again later.';
                } else if (status >= 500) {
                    errorMessage = 'Server error. Please try again later.';
                }
            } else if (error.request) {
                // Network error
                errorMessage = 'Network error. Please check your connection and try again.';
            }

            Alert.alert(
                'Sign Up Error',
                errorMessage,
                [{ text: 'OK', style: 'default' }]
            );
        } finally {
            setIsLoading(false);
        }
    };

    const isDisabled = !email.trim() || !name.trim() || isLoading;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.container}>
                            <Text style={styles.title}>Sign Up</Text>
                            <Text style={styles.subtitle}>Create an account to get started!</Text>

                            <View style={styles.inputContainer}>
                                <TextInput
                                    placeholder="Name"
                                    value={name}
                                    onChangeText={handleNameChange}
                                    style={[
                                        styles.inputName,
                                        nameError && styles.inputError
                                    ]}
                                    keyboardType="default"
                                    autoCapitalize="words"
                                    placeholderTextColor="#00000020"
                                    editable={!isLoading}
                                    maxLength={50}
                                />
                                {nameError ? (
                                    <Text style={styles.errorText}>{nameError}</Text>
                                ) : null}
                            </View>

                            <View style={styles.inputContainer}>
                                <TextInput
                                    placeholder="goodboy@woofmail.com"
                                    value={email}
                                    onChangeText={handleEmailChange}
                                    style={[
                                        styles.input,
                                        emailError && styles.inputError
                                    ]}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    placeholderTextColor="#00000020"
                                    editable={!isLoading}
                                    textContentType="emailAddress"
                                />
                                {emailError ? (
                                    <Text style={styles.errorText}>{emailError}</Text>
                                ) : null}
                            </View>

                            <TouchableOpacity
                                style={[styles.button, isDisabled && styles.buttonDisabled]}
                                onPress={getOtp}
                                disabled={isDisabled}
                                activeOpacity={0.8}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="#fff" size="small" />
                                ) : (
                                    <Text style={[styles.buttonText, isDisabled && styles.buttonTextDisabled]}>
                                        Sign Up
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        width: '100%',
        padding: 16,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 34,
        fontFamily: 'Recoleta',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'Roboto',
        marginTop: 16,
        marginBottom: 32,
        color: '#666',
        textAlign: 'center',
    },
    inputContainer: {
        width: '95%',
        marginBottom: 16,
    },
    input: {
        width: '100%',
        height: 58,
        borderColor: '#dbdbdb',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 12,
        letterSpacing: -0.43,
        fontSize: 16,
    },
    inputName: {
        width: '100%',
        height: 58,
        borderColor: '#dbdbdb',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 12,
        letterSpacing: -0.43,
        fontSize: 16,
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
        marginLeft: 4,
    },
    button: {
        width: '90%',
        height: 64,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 500,
        marginTop: 12,
    },
    buttonDisabled: {
        backgroundColor: '#76768012',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'Roboto',
    },
    buttonTextDisabled: {
        color: '#c8c8c8',
        fontSize: 18,
        fontFamily: 'Roboto',
        fontWeight: '500',
    },
});