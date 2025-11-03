import { RootStackParamList } from '@/app/views/auth/login';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
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
import { apiPost } from '../../utils/interceptor';

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'EnterEmail'>;
};

export default function EnterEmailScreen({ navigation }: Props) {
    const [email, setEmail] = useState('');

    const getOtp = () => {
        if (!email.trim()) {
            alert('Please enter your email');
            return;
        }
        apiPost('/user/send_login_otp', { email: email.trim() })
            .then((response) => {
                console.log('OTP sent successfully:', response);
                navigation.navigate('EnterOtp', { email: email.trim() });
            })
            .catch((error) => {
                console.error('Error sending OTP:', error);
            });
    };

    const isDisabled = !email.trim();

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
                        <Text style={styles.title}>Sign In</Text>
                        <Text style={styles.subtitle}>We will send you a sign in code</Text>
                        <TextInput
                            placeholder="goodboy@woofmail.com"
                            value={email}
                            onChangeText={setEmail}
                            style={styles.input}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            placeholderTextColor="#00000020"
                        />
                        <TouchableOpacity
                            style={[styles.button, isDisabled && styles.buttonDisabled]}
                            onPress={getOtp}
                            disabled={isDisabled}
                        >
                            <Text style={[styles.buttonText, isDisabled && styles.buttonTextDisabled]}>
                                Sign In
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
        marginBottom: 16,
        color: '#666',
        textAlign: 'center',
    },
    input: {
        marginBlock: 24,
        width: '95%',
        height: 58,
        borderColor: '#dbdbdb',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 12,
        letterSpacing: -0.43,
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