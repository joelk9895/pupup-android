import React, { useEffect, useState } from 'react';
import {
    LayoutAnimation,
    Platform,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    UIManager,
    View,
    ViewStyle,
} from 'react-native';

export type AccordionSection = {
    title: string;
    content: string | React.ReactNode;
    id?: string | number;
};

type Props = {
    sections: AccordionSection[];
    allowMultipleOpen?: boolean;
    containerStyle?: ViewStyle;
    headerStyle?: ViewStyle;
    titleStyle?: TextStyle;
    contentStyle?: ViewStyle;
    initiallyOpenIndex?: number;
    onChange?: (openIndices: number[]) => void;
};

function enableLayoutAnimationAndroid() {
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
        // @ts-ignore
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

export default function Accordion({
    sections,
    allowMultipleOpen = false,
    containerStyle,
    headerStyle,
    titleStyle,
    contentStyle,
    initiallyOpenIndex,
    onChange,
}: Props) {
    useEffect(() => {
        enableLayoutAnimationAndroid();
    }, []);

    const [openIndices, setOpenIndices] = useState<number[]>(
        initiallyOpenIndex != null ? [initiallyOpenIndex] : []
    );

    const toggleIndex = (index: number) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

        setOpenIndices((prev) => {
            let next: number[];
            if (prev.includes(index)) {
                next = prev.filter((i) => i !== index);
            } else {
                next = allowMultipleOpen ? [...prev, index] : [index];
            }
            onChange?.(next);
            return next;
        });
    };

    return (
        <View style={[styles.container, containerStyle]}>
            {sections.map((section, i) => {
                const isOpen = openIndices.includes(i);
                return (
                    <View key={section.id ?? i} style={styles.section}>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => toggleIndex(i)}
                            style={[styles.header, headerStyle]}
                            accessibilityRole="button"
                            accessibilityState={{ expanded: isOpen }}
                        >
                            <Text style={[styles.title, titleStyle]} numberOfLines={2}>
                                {section.title}
                            </Text>
                            <Text
                                style={[
                                    styles.chev,
                                    {
                                        transform: [
                                            { rotate: isOpen ? '90deg' : '0deg' }
                                        ],
                                    },
                                ]}
                            >
                                ›
                            </Text>
                        </TouchableOpacity>

                        {isOpen && (
                            <View style={[styles.content, contentStyle]}>
                                {typeof section.content === 'string' ? (
                                    <Text style={styles.contentText}>{section.content}</Text>
                                ) : (
                                    section.content
                                )}
                            </View>
                        )}
                    </View>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',

    },
    section: {
        marginBottom: 8,
        borderBottomWidth: 2,
        borderBottomColor: '#efefefff',
        transitionDelay: '500ms',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    title: {
        fontSize: 26,
        fontFamily: 'Recoleta',
        color: '#000',
        flex: 1,
        marginRight: 12,

    },
    chev: {
        fontSize: 30,
        color: '#888',
        width: 22,
        textAlign: 'center',
    },
    content: {
        paddingVertical: 12,
    },
    contentText: {
        fontSize: 14,
        color: '#444',
        lineHeight: 20,
    },
});