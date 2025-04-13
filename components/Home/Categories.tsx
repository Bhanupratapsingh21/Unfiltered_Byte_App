import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Link, RelativePathString } from 'expo-router';
import defaultCategories from '@/Data/Categorys';

const Categories = ({ categories = [] }) => {
    const items = categories.length > 0 ? categories : defaultCategories;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Categories</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer}
            >
                {items.map((item, index) => (
                    <Link
                        key={index}
                        style={styles.cardWrapper}
                        href={`/Activitys/${item.type}` as RelativePathString}
                    >
                        <View style={[styles.card, { backgroundColor: item.bgColor }]}>
                            <View style={[styles.iconContainer, { backgroundColor: item.iconBgColor }]}>
                                {item.icon}
                            </View>
                        </View>
                    </Link>
                ))}
            </ScrollView>
        </View>
    );
};

export default Categories;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingBottom: 10,
    },
    title: {
        fontWeight: '800',
        fontSize: 20,
        color: '#FFFFFF',
        marginBottom: 8,
    },
    scrollContainer: {
        paddingVertical: 5,
    },
    cardWrapper: {
        marginRight: 12,
    },
    card: {
        height: 56,
        width: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#FFB700',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    iconContainer: {
        height: 36,
        width: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
