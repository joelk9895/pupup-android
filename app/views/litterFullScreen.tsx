import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { AVPlaybackStatus, ResizeMode, Video } from 'expo-av';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SharedElement } from 'react-navigation-shared-element';
import CloseIcon from '../icons/closeIcon';
import { RootStackParamList } from '../types/navigation';

type LitterFullScreenRouteProp = RouteProp<RootStackParamList, 'LitterFullScreen'>;

export default function LitterFullScreen() {
    const navigation = useNavigation();
    const route = useRoute<LitterFullScreenRouteProp>();
    const { id, name, image_url, video_id, puppies, expected_dogs, slots_filled, created_at } = route.params;
    const videoRef = useRef<Video>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isBuffering, setIsBuffering] = useState(false);
    const [videoLoaded, setVideoLoaded] = useState(false);
    const [videoError, setVideoError] = useState(false);
    const [bookedPuppies, setBookedPuppies] = useState<number>(0);
    const [totalPuppies, setTotalPuppies] = useState<number>(0);


    useEffect(() => {
        if (puppies.length > 0) {
            const booked = puppies.filter(pup => pup.booked).length;
            const total = puppies.length;
            setBookedPuppies(booked);
            setTotalPuppies(total);
        } else {
            setBookedPuppies(slots_filled);
            setTotalPuppies(expected_dogs);
        }
    }, [puppies, slots_filled, expected_dogs]);

    const days = created_at ? Math.floor((new Date().getTime() - new Date(created_at).getTime()) / (1000 * 60 * 60 * 24)) : 0;

    const togglePlayPause = async () => {
        if (!videoRef.current || videoError) return;

        if (isPlaying) {
            await videoRef.current.pauseAsync();
        } else {
            await videoRef.current.playAsync();
        }
    };

    const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
        if (status.isLoaded) {
            setIsPlaying(status.isPlaying);
            setIsBuffering(status.isBuffering);
            if (!videoLoaded && status.isPlaying) {
                setVideoLoaded(true);
            }
        }
    };

    const handleVideoError = (error: string) => {
        console.error('Video Error:', error);
        setVideoError(true);
        setVideoLoaded(false);
        setIsBuffering(false);
    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="black" barStyle="light-content" />
            <View style={styles.content}>
                <View style={styles.mediaParent}>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={togglePlayPause}
                        style={styles.mediaContainer}
                    >
                        {(!videoLoaded || videoError) && (
                            <SharedElement id={`litter.${id}.image`} style={StyleSheet.absoluteFill}>
                                <Image
                                    source={{ uri: image_url }}
                                    style={styles.media}
                                />
                            </SharedElement>
                        )}

                        {!videoError && (
                            <Video
                                ref={videoRef}
                                source={{ uri: `https://stream.mux.com/${video_id}.m3u8` }}
                                style={[styles.media, !videoLoaded && { opacity: 0 }]}
                                shouldPlay={true}
                                isLooping={true}
                                isMuted={true}
                                resizeMode={ResizeMode.COVER}
                                onPlaybackStatusUpdate={onPlaybackStatusUpdate}
                                onError={handleVideoError}
                            />
                        )}

                        {isBuffering && videoLoaded && !videoError && (
                            <View style={styles.playPauseOverlay}>
                                <ActivityIndicator size="large" color="#fff" />
                            </View>
                        )}
                    </TouchableOpacity>

                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => navigation.goBack()}
                        >
                            <CloseIcon />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.bottomSection}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text numberOfLines={2} style={styles.litterTitle}>
                            {name || 'The Luminaries Litter'}
                        </Text>
                        <Text style={styles.litterTime}>
                            {days > 0 ? `${days} days ago` : 'Just now'}
                        </Text>
                    </View>
                    <View style={styles.puppiesRow}>
                        {Array.from({ length: totalPuppies }, (_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.puppyCircle,
                                    index < bookedPuppies && styles.filledCircle,
                                ]}
                            />
                        ))}
                    </View>
                    <Text style={styles.litterInfo}>
                        {totalPuppies > 0 ? `${bookedPuppies} of ${totalPuppies} puppies booked` : 'Accepting Expression of Interest'}
                    </Text>
                    <TouchableOpacity style={styles.viewButton}>
                        <Text style={styles.viewButtonText}>View Litter</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

LitterFullScreen.sharedElements = (route: LitterFullScreenRouteProp) => {
    const { id } = route.params;
    return [`litter.${id}.image`];
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    content: {
        flex: 1,
        marginTop: Platform.OS === 'android' ? ((StatusBar.currentHeight ?? 0) + 10) : 60,
    },
    mediaParent: {
        height: '70%',
        width: '98%',
        marginHorizontal: '1%',
        position: 'relative',
        borderRadius: 26,
    },
    mediaContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 26,
    },
    media: {
        width: '100%',
        height: '100%',
        borderRadius: 26,
    },
    header: {
        position: 'absolute',
        top: 16,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 16,
        zIndex: 10,
    },
    closeButton: {
        width: 32,
        height: 32,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomSection: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 20,
        paddingBottom: 40,
    },
    litterTitle: {
        color: '#FFFFFF',
        fontSize: 21,
        lineHeight: 20,
        fontFamily: 'Roboto',
        fontWeight: '600',
        marginBottom: 8,
        maxWidth: '70%',
    },
    litterInfo: {
        color: '#949494',
        fontSize: 13,
        fontFamily: 'Roboto',
        fontWeight: '400',
        lineHeight: 20,
        marginBottom: 16,
    },
    viewButton: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 16,
        borderRadius: 20,
        alignItems: 'center',
    },
    viewButtonText: {
        color: '#000000',
        fontSize: 16,
        lineHeight: 16,
        fontFamily: 'Roboto',
        fontWeight: '600',
    },
    puppiesRow: {
        flexDirection: 'row',
        gap: 1,
        marginVertical: 4,
    },
    puppyCircle: {
        width: 10,
        height: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#FFFFFF',
    },
    filledCircle: {
        backgroundColor: '#FFFFFF',
    },
    playPauseOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    litterTime: {
        color: '#949494',
        fontSize: 13,
        fontFamily: 'Roboto',
        fontWeight: '400',
        lineHeight: 20,
    },
});