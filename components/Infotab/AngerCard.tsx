import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { RelativePathString, Link } from 'expo-router';

interface CardProps {
    icon: React.ReactNode;
    bgColor: string;
    iconBgColor: string;
    issueText: string;
    description: string;
    type: string;
}

const Card: React.FC<CardProps> = ({
    icon,
    bgColor,
    iconBgColor,
    issueText,
    description,
    type
}) => {
    return (
        <View style={[styles.cardContainer, { backgroundColor: bgColor }]}>
            <Link href={`/Activitys/${type}` as RelativePathString} asChild>
                <Pressable style={{ flex: 1 }}>
                    <View style={styles.topSection}>
                        <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
                            {icon}
                        </View>
                        <Text style={styles.issueText}>{issueText}</Text>
                    </View>
                    <Text style={styles.descriptionText}>{description}</Text>
                </Pressable>
            </Link>
        </View>
    );
};

export default Card;

const styles = StyleSheet.create({
    cardContainer: {
        width: 150,
        height: 113,
        borderRadius: 12,
        padding: 12,
        margin: 8,
        justifyContent: 'space-between',
        backgroundColor: '#1F1F1F',
        shadowColor: '#FFB700',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
    },
    topSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    issueText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFFFFF',
        flexShrink: 1,
    },
    descriptionText: {
        fontSize: 12,
        color: '#B0B0B0',
        marginTop: 4,
    },
});
