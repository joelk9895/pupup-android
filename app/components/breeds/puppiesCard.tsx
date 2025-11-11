import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import GenderIcon from '../../icons/genderIcon';

type Puppy = {
    id: number;
    name: string;
    gender?: string;
    description?: string;
    image_url?: string;
    booked?: boolean;
    breed?: string;
};

type Props = {
    puppy: Puppy;
    onPress?: () => void;
    showBookedStatus?: boolean;
    imagePosition?: 'left' | 'right';
    size?: 'small' | 'medium' | 'large';
};

export default function PuppiesCard({
    puppy,
    onPress,
    showBookedStatus = false,
    imagePosition = 'right',
    size = 'medium'
}: Props) {
    const imageSize = size === 'small' ? 80 : size === 'medium' ? 120 : 160;
    const isBooked = showBookedStatus && puppy.booked;

    const CardContent = (
        <View style={[
            styles.puppyRow,
            imagePosition === 'left' && styles.imageLeft,
            isBooked && styles.puppyRowDisabled
        ]}>
            <View style={styles.puppyInfoSection}>
                <View style={styles.puppyInfo}>
                    <Text style={[
                        styles.puppyName,
                        size === 'small' && styles.puppyNameSmall,
                        size === 'large' && styles.puppyNameLarge,
                        isBooked && styles.puppyNameDisabled
                    ]}>
                        {puppy.name}
                    </Text>
                    <View style={isBooked && styles.iconDisabled}>
                        <GenderIcon gender={puppy.gender ?? 'UNKNOWN'} />
                    </View>
                </View>

                {puppy.description && (
                    <Text
                        numberOfLines={size === 'small' ? 2 : 6}
                        style={[
                            styles.puppyDescription,
                            size === 'small' && styles.descriptionSmall,
                            isBooked && styles.puppyDescriptionDisabled
                        ]}
                    >
                        {puppy.description}
                    </Text>
                )}
            </View>

            {puppy.image_url && (
                <View style={isBooked && styles.imageContainer}>
                    <Image
                        source={{ uri: puppy.image_url }}
                        style={[
                            styles.puppyImage,
                            { width: imageSize, height: imageSize },
                        ]}
                    />
                    {isBooked && (
                        <View style={styles.bookedBadge}>
                            <Text style={styles.bookedText}>Puppy Reserved</Text>
                        </View>
                    )}
                </View>
            )}
        </View>
    );

    if (onPress && !isBooked) {
        return (
            <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
                {CardContent}
            </TouchableOpacity>
        );
    }

    return CardContent;
}

const styles = StyleSheet.create({
    puppyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#F5F5F5',
        borderRadius: 12,
        padding: 12,
        backgroundColor: '#FFF',
    },
    puppyRowDisabled: {
        backgroundColor: '#F8F9FA',
        borderColor: '#E9ECEF',
        opacity: 1,
    },
    imageLeft: {
        flexDirection: 'row-reverse',
    },
    puppyInfoSection: {
        flex: 1,
        flexDirection: 'column',
        marginRight: 12,
        alignItems: 'flex-start',
        gap: 4,
    },
    puppyInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    puppyName: {
        fontSize: 24,
        fontFamily: 'Figtree_600SemiBold',
        color: '#000',
        marginBottom: 4,
    },
    puppyNameSmall: {
        fontSize: 18,
    },
    puppyNameLarge: {
        fontSize: 28,
    },
    puppyNameDisabled: {
        color: '#6C757D',
    },
    puppyDescription: {
        marginTop: 4,
        color: '#020617',
        lineHeight: 20,
        fontSize: 14,
        fontFamily: 'Roboto',
    },
    puppyDescriptionDisabled: {
        color: '#6C757D',
    },
    descriptionSmall: {
        fontSize: 12,
        lineHeight: 16,
    },
    puppyImage: {
        borderRadius: 12,
        backgroundColor: '#F0F0F0',
    },

    imageContainer: {
        position: 'relative',
    },
    iconDisabled: {
        opacity: 0.5,
    },
    bookedBadge: {
        backgroundColor: '#1f1f1faa',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        position: 'absolute',
        bottom: 8,
        left: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 4,
        zIndex: 10,
    },
    bookedText: {
        color: '#FFF',
        fontSize: 12,
        fontFamily: 'Figtree_500Medium',
        textTransform: 'uppercase',
    },
});