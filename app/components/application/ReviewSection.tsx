import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type ReviewItemProps = {
    question: string;
    answer: string | string[];
};

export const ReviewItem: React.FC<ReviewItemProps> = ({ question, answer }) => {
    const displayAnswer = Array.isArray(answer) ? answer.join(', ') : answer;

    return (
        <View style={styles.reviewItem}>
            <Text style={styles.question}>{question}</Text>
            <Text style={styles.answer}>{displayAnswer}</Text>
        </View>
    );
};

type ReviewSectionProps = {
    title: string;
    children: React.ReactNode;
};

export const ReviewSection: React.FC<ReviewSectionProps> = ({ title, children }) => (
    <View style={styles.section}>
        {children}
    </View>
);

const styles = StyleSheet.create({
    section: {
        marginBottom: 12,
    },
    reviewItem: {
        marginBottom: 16,
        paddingBottom: 16,
    },
    question: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4A5568',
        marginBottom: 4,
    },
    answer: {
        fontSize: 16,
        color: '#1A202C',
        lineHeight: 22,
    },
});