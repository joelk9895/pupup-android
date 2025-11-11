import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type ProgressBarProps = {
    currentStep: number;
    totalSteps: number;
};

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => (
    <View style={styles.parent}>
        <Text style={styles.stepText}>{`${currentStep}/${totalSteps}`}</Text>
        <View style={styles.container}>
            {Array.from({ length: totalSteps }, (_, index) => (
                <View
                    key={index}
                    style={[
                        styles.step,
                        index < currentStep ? styles.activeStep : styles.inactiveStep,
                    ]}
                />
            ))}
        </View>
    </View>
);

const styles = StyleSheet.create({
    parent: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        marginVertical: 20,
        gap: 12,
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    step: {
        height: 2,
        flex: 1,
        borderRadius: 2,
    },
    activeStep: {
        backgroundColor: '#007AFF',
    },
    inactiveStep: {
        backgroundColor: '#E1E1E1',
    },
    stepText: {
        alignSelf: 'flex-start',
        fontSize: 14,
        color: '#000',
        fontWeight: '600',
    },
});