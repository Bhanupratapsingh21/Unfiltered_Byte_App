import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Link, RelativePathString } from 'expo-router';
import activitiesData from "@/Data/activity";

const Categories = ({ categories = [] }) => {
    let items: string[] = []
    
    activitiesData.forEach((item) => {
        if (!items.includes(item.type)) {
            items.push(item.type);
        }
    });

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Activity Categories</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer}
            >
                {items.map((item, index) => (
                    <Link
                        key={index}
                        style={styles.cardWrapper}
                        href={`/Activitys/${item}` as RelativePathString}
                    >
                        <View style={styles.tag}>
                            <Text style={styles.tagText}>{item}</Text>
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

        paddingBottom: 10,
    },
    title: {
        paddingHorizontal: 16,
        fontWeight: '800',
        fontSize: 20,
        color: '#FFFFFF',
        marginBottom: 8,
    },
    scrollContainer: {
        paddingLeft : 16,
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
    tagContainer: {
        paddingHorizontal: 16,
        paddingBottom: 15,
        gap: 8,
        height: 60,
        alignItems: "center",
    },
    tag: {
        borderColor: "#fff",
        borderWidth: 0.4,
        borderRadius: 20,
        height: 30,
        paddingHorizontal: 16,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
    tagText: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "500",
    },
    sectionHeader: {
        paddingHorizontal: 16,
        paddingBottom: 8,
    },
    sectionTitle: {
        color: "#FFFFFF",
        fontSize: 20,
        fontWeight: "700",
    },
    errorText: {
        color: "#ff4444",
        fontSize: 12,
        marginTop: 4,
    },
    loadingContainer: {
        height: 60,
        justifyContent: "center",
        alignItems: "center",
    },
});
