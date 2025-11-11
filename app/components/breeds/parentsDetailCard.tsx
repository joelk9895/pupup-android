import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import GenderIcon from '../../icons/genderIcon';

type ParentType = 'FATHER' | 'MOTHER';

type Props = {
    parent: {
        id: number;
        name: string;
        description?: string;
        image_url?: string;
        gender?: string;
        medical_info?: any[];
    };
    type: ParentType;
};

export default function ParentsDetailCard({ parent, type }: Props) {
    const isfather = type === 'FATHER';
    const labelColor = isfather ? '#007AFF' : '#FF2D92';
    const genderType = isfather ? 'MALE' : 'FEMALE';

    return (
        <View style={styles.container}>
            <Image
                source={{ uri: parent.image_url || '' }}
                style={styles.image}
            />
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={[styles.typeLabel, { color: labelColor }]}>
                        {type.toLowerCase()}
                    </Text>
                    <GenderIcon gender={genderType} />
                </View>
                <Text style={styles.name}>{parent.name}</Text>
                {parent.description ? (
                    <Text style={styles.description}>{parent.description}</Text>
                ) : null}
                {parent.medical_info && parent.medical_info.length > 0 ? (
                    <>
                        <Text style={[styles.medicalInfoTitle, { marginTop: 12 }]}>MEDICAL</Text>
                        <View style={styles.medicalInfo}>
                            {parent.medical_info.map((info, index) => (
                                <Text key={index} style={styles.medicalInfoText}>{info.title}</Text>
                            ))}
                        </View>
                    </>
                ) : null}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
        borderRadius: 18,
        backgroundColor: '#FFF',
        padding: 0,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    image: {
        width: '100%',
        height: 200,
        marginBottom: 12,
    },
    content: {
        paddingHorizontal: 20,
        paddingBottom: 16,
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
        marginTop: 12,
        marginBottom: 8,
    },
    typeLabel: {
        fontSize: 13,
        fontFamily: 'Figtree_700Bold',
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 1.63,
    },
    name: {
        fontSize: 26,
        fontFamily: 'Figtree_600SemiBold',
        marginBottom: 12,
        color: '#222',
    },
    description: {
        marginTop: 4,
        color: '#020617',
        lineHeight: 24,
        fontSize: 14,
    },
    medicalInfo: {
        marginTop: 12,
    },
    medicalInfoText: {
        fontSize: 13,
        color: '#000',
        marginBottom: 12,
        fontWeight: '500',
    },
    medicalInfoTitle: {
        fontSize: 18,
        fontFamily: 'Figtree_700Bold',
        color: '#000',
        marginTop: 16,
    },
});