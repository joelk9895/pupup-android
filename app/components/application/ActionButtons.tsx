import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type ActionButtonsProps = {
    primaryLabel: string;
    onPrimaryPress: () => void;
    onBack?: () => void;
    disabled?: boolean;
};

export const ActionButtons: React.FC<ActionButtonsProps> = ({
    primaryLabel,
    onPrimaryPress,
    onBack,
    disabled = false,
}) => (
    <View style={styles.container}>
        <View style={styles.buttonRow}>
            {onBack && (
                <TouchableOpacity style={styles.backButton} onPress={onBack}>
                    <Text style={styles.backButtonIcon}>←</Text>
                </TouchableOpacity>
            )}
            <TouchableOpacity
                style={[
                    styles.primaryButton,
                    onBack ? styles.buttonWithBack : styles.buttonFullWidth,
                    disabled && styles.primaryButtonDisabled,
                ]}
                onPress={disabled ? undefined : onPrimaryPress}
                disabled={disabled}
            >
                <Text style={[
                    styles.primaryButtonText,
                    disabled && styles.primaryButtonTextDisabled,
                ]}>
                    {primaryLabel}
                </Text>
            </TouchableOpacity>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        paddingTop: 20,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 0.25,
        borderTopColor: '#E2E8F0',
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
    },
    backButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F8F9FA',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    backButtonIcon: {
        fontSize: 20,
        color: '#333',
        fontWeight: 'bold',
    },
    primaryButton: {
        backgroundColor: '#000',
        borderRadius: 500,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryButtonDisabled: {
        backgroundColor: '#E2E8F0',
    },
    buttonWithBack: {
        flex: 1,
    },
    buttonFullWidth: {
        flex: 1,
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    primaryButtonTextDisabled: {
        color: '#9CA3AF',
    },
    closeButton: {
        position: 'absolute',
        top: -40,
        right: 20,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F8F9FA',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    closeButtonText: {
        fontSize: 16,
        color: '#666',
        fontWeight: 'bold',
    },
});