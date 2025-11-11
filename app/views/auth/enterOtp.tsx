import { APIError, apiPost, LoginResponse } from '@/app/utils/interceptor';
import { RootStackParamList } from '@/app/views/auth/login';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState } from 'react';
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
    View
} from 'react-native';
import { useAuth } from '../../context/AuthContext';

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'EnterOtp'>;
    route: RouteProp<RootStackParamList, 'EnterOtp'>;
};

export default function EnterOtpScreen({ navigation, route }: Props) {
    const { email, name } = route.params;
    const [otp, setOtp] = useState(Array(6).fill(''));
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState('');
    const inputs = useRef<TextInput[]>([]);
    const { login } = useAuth();

    const handleChange = (text: string, index: number) => {
        // Clear error when user starts typing
        if (error) setError('');

        const newOtp = [...otp];
        newOtp[index] = text.slice(-1); // only last digit
        setOtp(newOtp);

        if (text && index < 5) {
            inputs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    const generateRandomPassword = () => {
        const length = 16;
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
        let password = '';
        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        return password;
    };

    const verifyOtp = async () => {
        const code = otp.join('');

        // Validate OTP is complete and numeric
        if (code.length !== 6 || !/^\d{6}$/.test(code)) {
            setError('Please enter a valid 6-digit code');
            return;
        }

        setIsVerifying(true);
        setError('');

        try {
            if (name) {
                const response: LoginResponse = await apiPost<LoginResponse>('/user/sign_up', {
                    email,
                    otp: parseInt(code),
                    name,
                    password: generateRandomPassword()
                });
                await login(response, response.token);
            } else {
                const response: LoginResponse = await apiPost<LoginResponse>('/user/login', {
                    email,
                    otp: parseInt(code)
                });
                await login(response, response.token);
            }
        } catch (error: any) {
            console.error('Error verifying OTP:', error);

            let errorMessage = 'Failed to verify code. Please try again.';

            if (error instanceof APIError) {
                const status = error.status;

                if (status === 400 && error.message.includes('invalid code')) {
                    errorMessage = 'Invalid verification code. Please check and try again.';
                } else if (status === 400 && error.message.includes('Email already exist')) {
                    errorMessage = 'Email already exists. Please sign in instead.';
                    navigation.navigate('EnterEmail');

                } else if (status === 401) {
                    errorMessage = 'Incorrect verification code. Please try again.';
                } else if (status === 404) {
                    errorMessage = 'Email not found. Please sign up first.';
                } else if (status === 410 || status === 408) {
                    errorMessage = 'Verification code expired. Please request a new one.';
                } else if (status === 429) {
                    errorMessage = 'Too many attempts. Please try again later.';
                } else if (status && status >= 500) {
                    errorMessage = 'Server error. Please try again later.';
                } else if (error.message) {
                    errorMessage = error.message;
                }
            } else if (error.message?.includes('Network')) {
                errorMessage = 'Network error. Please check your connection.';
            }

            setError(errorMessage);

            // Clear OTP inputs on error
            setOtp(Array(6).fill(''));
            inputs.current[0]?.focus();

            Alert.alert(
                'Verification Failed',
                errorMessage,
                [{ text: 'OK', style: 'default' }]
            );
        } finally {
            setIsVerifying(false);
        }
    };

    useEffect(() => {
        if (otp.every((digit) => digit !== '') && !isVerifying) {
            verifyOtp();
        }
    }, [otp]);

    const resendOtp = async () => {
        try {
            setError('');
            const endpoint = name ? '/user/send_otp' : '/user/send_login_otp';

            await apiPost(endpoint, { email });

            Alert.alert(
                'Code Sent',
                'A new verification code has been sent to your email.',
                [{ text: 'OK', style: 'default' }]
            );

        } catch (error: any) {
            console.error('Error resending OTP:', error);

            let errorMessage = 'Failed to resend code. Please try again.';

            if (error instanceof APIError) {
                const status = error.status;

                if (status === 404) {
                    errorMessage = 'Email not found.';
                } else if (status === 429) {
                    errorMessage = 'Too many requests. Please wait before trying again.';
                } else if (status && status >= 500) {
                    errorMessage = 'Server error. Please try again later.';
                } else if (error.message) {
                    errorMessage = error.message;
                }
            }

            Alert.alert(
                'Resend Failed',
                errorMessage,
                [{ text: 'OK', style: 'default' }]
            );
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: '#fff' }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
                bounces={false}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.container}>
                        <Text style={styles.title}>Check your email</Text>
                        <Text style={styles.subtitle}>
                            We&apos;ve sent a verification email to{' '}
                            <Text style={{ fontWeight: '600', color: '#000' }}>{email}</Text>{' '}
                            please enter the code below.
                        </Text>

                        {error ? (
                            <View style={styles.errorContainer}>
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        ) : null}

                        <View style={styles.otpContainer}>
                            {otp.map((digit, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.otpInputWrapper,
                                        focusedIndex === index && styles.otpInputWrapperFocused,
                                        error && styles.otpInputWrapperError,
                                    ]}
                                >
                                    <TextInput
                                        ref={(ref) => {
                                            inputs.current[index] = ref!;
                                        }}
                                        style={[
                                            styles.otpInput,
                                            focusedIndex === index && styles.otpInputFocused,
                                            error && styles.otpInputError,
                                        ]}
                                        keyboardType="numeric"
                                        maxLength={1}
                                        value={digit}
                                        placeholder="-"
                                        placeholderTextColor="#00000020"
                                        caretHidden={true}
                                        editable={!isVerifying}
                                        onChangeText={(text) => handleChange(text, index)}
                                        onKeyPress={(e) => handleKeyPress(e, index)}
                                        onFocus={() => setFocusedIndex(index)}
                                        onBlur={() => setFocusedIndex(null)}
                                    />
                                </View>
                            ))}
                        </View>

                        {isVerifying && (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="small" color="#007AFF" />
                                <Text style={styles.loadingText}>Verifying...</Text>
                            </View>
                        )}

                        <TouchableOpacity
                            style={[styles.button, isVerifying && styles.buttonDisabled]}
                            onPress={resendOtp}
                            disabled={isVerifying}
                        >
                            <Image
                                source={require('@/assets/images/resendIcon.png')}
                                style={{ width: 16, height: 16, marginBottom: 2, marginRight: 8 }}
                            />
                            <Text style={styles.buttonText}>
                                Resend Email
                            </Text>
                        </TouchableOpacity>
                    </View>
                </TouchableWithoutFeedback>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
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
        marginBottom: 16,
        color: '#666',
        textAlign: 'center',
    },
    errorContainer: {
        backgroundColor: '#fee',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        width: '90%',
    },
    errorText: {
        color: '#dc3545',
        fontSize: 14,
        fontFamily: 'Roboto',
        textAlign: 'center',
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        marginBottom: 24,
    },
    otpInputWrapper: {
        borderWidth: 3,
        borderColor: 'transparent',
        borderRadius: 18,
        padding: 0,
    },
    otpInputWrapperFocused: {
        borderColor: '#007bff20',
    },
    otpInputWrapperError: {
        borderColor: '#dc354520',
    },
    otpInput: {
        width: 52,
        height: 60,
        borderWidth: 2,
        borderColor: '#dbdbdb',
        borderRadius: 16,
        textAlign: 'center',
        fontSize: 22,
        fontFamily: 'Roboto',
        color: '#000',
        backgroundColor: '#fff',
    },
    otpInputFocused: {
        borderColor: '#007bff',
    },
    otpInputError: {
        borderColor: '#dc3545',
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    loadingText: {
        marginLeft: 8,
        fontSize: 14,
        fontFamily: 'Roboto',
        color: '#666',
    },
    button: {
        width: '90%',
        height: 64,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 500,
        marginTop: 24,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: '#007AFF',
        fontSize: 13,
        fontFamily: 'Roboto',
    },
});