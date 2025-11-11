import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type QuestionSectionProps = {
    question: string;
    marginTop?: number;
    marginBottom?: number;
    children: React.ReactNode;
};

export const QuestionSection: React.FC<QuestionSectionProps> = ({
    question,
    marginTop = 20,
    marginBottom = 16,
    children
}) => (
    <View style={[styles.container, { marginTop, marginBottom }]}>
        <Text style={styles.questionText}>
            {question}
        </Text>
        {children}
    </View>
);

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    questionText: {
        fontSize: 15,
        fontWeight: '500',
        color: '#0F172A',
        marginBottom: 8,
        lineHeight: 24,
    },
});