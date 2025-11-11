import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ProgressBar } from './ProgressBar';

type StepPageProps = {
    title: string;
    currentStep: number;
    totalSteps: number;
    children: React.ReactNode;
    onClose?: () => void;
};

export const StepPage: React.FC<StepPageProps> = ({
    title,
    currentStep,
    totalSteps,
    children,
    onClose
}) => (
    <SafeAreaView style={styles.container}>
        <View style={styles.content}>
            <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                {onClose && (
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>✕</Text>
                    </TouchableOpacity>
                )}
            </View>
            {(currentStep > 0 && currentStep < totalSteps) && (<ProgressBar currentStep={currentStep} totalSteps={totalSteps} />)}

            <View style={styles.questionsContainer}>
                {children}
            </View>
        </View>
    </SafeAreaView>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
        marginTop: 40,
    },
    title: {
        fontSize: 39,
        fontWeight: '700',
        color: '#1A202C',
        lineHeight: 44,
        fontFamily: 'Recoleta',
        flex: 1,
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 16,
    },
    closeButtonText: {
        fontSize: 18,
        color: '#666',
        fontWeight: '600',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 22,
    },
    questionsContainer: {
        flex: 1,
    },
});