import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import PuppiesCard from '../components/breeds/puppiesCard';
import { RootStackParamList } from '../types/navigation';

type ApplicationSuccessRouteProp = RouteProp<RootStackParamList, 'ApplicationSuccess'>;
type ApplicationSuccessNavigationProp = StackNavigationProp<RootStackParamList, 'ApplicationSuccess'>;

export default function ApplicationSuccess() {
    const navigation = useNavigation<ApplicationSuccessNavigationProp>();
    const route = useRoute<ApplicationSuccessRouteProp>();
    const confettiRef = useRef<any>(null);

    const { puppy } = route.params ?? {
        puppyName: 'the puppy',
        breederName: 'the breeder'
    };

    useEffect(() => {
        // Trigger confetti on mount
        if (confettiRef.current) {
            confettiRef.current.start();
        }
    }, []);

    const handleDone = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
        });
    };

    const handleViewMessages = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Messages' }],
        });
    };

    return (
        <View style={styles.container}>
            <ConfettiCannon
                ref={confettiRef}
                count={100}
                origin={{ x: -10, y: 0 }}
                autoStart={false}
                fadeOut={true}
                fallSpeed={4000}
                colors={['#34C759', '#007AFF', '#FF9500', '#FF2D55', '#5856D6']}
            />

            <View style={styles.content}>

                <Text style={styles.title}>Puppy Application Complete</Text>
                <Text style={styles.subtitle}>
                    The breeder will be in touch shortly.
                </Text>
                <View style={styles.infoContainer}>

                    <View style={styles.infoBox}>
                        <PuppiesCard puppy={puppy ?? { id: 0, name: '', breed: '', gender: '', description: '', image_url: '', booked: false }} />
                    </View>
                </View>

            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>


                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={handleDone}
                    activeOpacity={0.7}
                >
                    <Text style={styles.secondaryButtonText}>Love It</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        marginBottom: 32,
    },
    successCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#34C759',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#34C759',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    checkmark: {
        fontSize: 48,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    title: {
        fontSize: 39,
        fontWeight: '700',
        color: '#1A202C',
        marginBottom: 12,
        textAlign: 'center',
        fontFamily: 'Recoleta',
    },
    subtitle: {
        fontSize: 16,
        color: '#4A5568',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
        paddingHorizontal: 16,
    },
    infoBox: {
        borderRadius: 16,
        width: '100%',
        transform: [{ rotate: '2deg' }],
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1A202C',
        marginBottom: 16,
    },
    infoItem: {
        flexDirection: 'row',
        marginBottom: 12,
        alignItems: 'flex-start',
    },
    infoContainer: {
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 16,
        width: '90%',
    },
    bulletPoint: {
        fontSize: 16,
        color: '#007AFF',
        marginRight: 8,
        fontWeight: 'bold',
    },
    infoText: {
        fontSize: 15,
        color: '#4A5568',
        lineHeight: 22,
        flex: 1,
    },
    buttonContainer: {
        paddingHorizontal: 24,
        paddingBottom: 40,
        gap: 12,
    },
    primaryButton: {
        backgroundColor: '#007AFF',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '600',
    },
    secondaryButton: {
        backgroundColor: '#000',
        borderRadius: 500,
        paddingVertical: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    secondaryButtonText: {
        color: '#FFF',
        fontSize: 17,
        fontWeight: '600',
    },
});