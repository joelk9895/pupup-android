import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useVideoPlayer, VideoView } from 'expo-video';
import React from 'react';
import { Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GoogleIcon from '../icons/googleIcon';
import PupUpLogo from '../icons/pupupLogo';
import { RootStackParamList } from './auth/login';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'Start'>;


export default function StarterScreen() {
    const navigation = useNavigation<NavProp>();
    const insets = useSafeAreaInsets();
    const videoSource = require('@/assets/videos/video_background.mov');

    const player = useVideoPlayer(videoSource, player => {
        player.loop = true;
        player.muted = true;
        player.play();
    });

    const topOffset = Platform.OS === 'android' ? ((StatusBar.currentHeight ?? 0) + 10) : 60;

    return (
        <View style={styles.container}>
            <StatusBar
                translucent={true}
                backgroundColor="transparent"
                barStyle="light-content"
            />
            <VideoView
                style={styles.videoBackground}
                player={player}
                contentFit="cover"
                nativeControls={false}
            />
            <LinearGradient
                colors={['transparent', 'rgb(0, 0, 0)']}
                locations={[0.2, 1]}
                style={[StyleSheet.absoluteFillObject, { top: topOffset }]}
            />
            <View style={[styles.contentContainer]}>
                <PupUpLogo />
                <Text style={{ marginTop: 30, color: '#FFFFFF', fontSize: 24, fontFamily: 'Recoleta', textAlign: 'center', maxWidth: 300 }}>
                    The best start{"\n"}
                    to a lifetime of love.
                </Text>
            </View>
            <View style={[styles.actionsContainer, { paddingBottom: insets.bottom + 20 }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate('EnterEmailSignup');
                    }}>
                        <Text style={styles.signUpText}>Sign Up</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { }}>
                        <View style={styles.googleButton}>
                            <GoogleIcon />
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => {
                }}>
                    <Text style={styles.signInText}>Sign In</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    videoBackground: {
        ...StyleSheet.absoluteFillObject,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionsContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20,
    },
    signUpText: {
        backgroundColor: '#152C70',
        color: '#FFFFFF',
        paddingVertical: 20,
        paddingHorizontal: 60,
        borderRadius: 500,
        fontSize: 18,
        fontFamily: 'Figtree_600SemiBold',
    },
    googleButton: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 500,
    },
    signInText: {
        color: '#565D6A',
        marginTop: 20,
        fontSize: 18,
        textDecorationLine: 'underline',
    },
});
