import React, { useState, useEffect, useCallback } from "react";
import { View, Pressable, Text, ScrollView, ActivityIndicator, RefreshControl, StyleSheet, Platform } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import ActivityCard from "@/components/Home/ActivityCard";
import ActivityService from "@/lib/activity";
import { ActivityType } from "@/types/activitycard.types";
import activitiesData from "@/Data/activity";


export default function ActivitiesByTypeScreen() {
    const { type } = useLocalSearchParams();
    const [activities, setActivities] = useState<ActivityType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const limit = 10; // Number of items per page


    // Fetch activities with pagination
    const fetchActivities = useCallback(async () => {

        try {
            setLoading(true);
            setError(null);
            const newActivities = activitiesData.filter(activity => activity.type === type);
            setActivities(newActivities as ActivityType[]);

        } catch (err) {
            setError(`Failed to fetch activities. Please try again.`);
            console.error("Error fetching activities:", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [type]);

    // Initial load
    useEffect(() => {
        fetchActivities();
    }, [fetchActivities]);

    // Handle refresh
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setPage(1);
        setHasMore(true);
    }, [fetchActivities]);


    if (error && activities.length === 0) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()} style={styles.backButton}>
                        <AntDesign name="arrowleft" size={24} color="white" />
                    </Pressable>
                    <Text style={styles.title}>{type}</Text>
                    <View style={styles.backButton2} />
                </View>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <Pressable onPress={() => fetchActivities()} style={styles.retryButton}>
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </Pressable>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <AntDesign name="arrowleft" size={24} color="white" />
                </Pressable>
                <Text style={styles.title}>{type}</Text>
                <View style={styles.backButton2} />
            </View>

            {/* Content */}
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={["#04714A"]}
                        tintColor="#04714A"
                    />
                }
                scrollEventThrottle={400}
            >
                {activities.map(activity => (
                    <ActivityCard {...activity} />
                ))}

                {loading && activities.length > 0 && (
                    <View style={styles.loadingMoreContainer}>
                        <ActivityIndicator size="small" color="#04714A" />
                    </View>
                )}

                {!hasMore && (
                    <View style={styles.endOfListContainer}>
                        <Text style={styles.endOfListText}>No more activities to show</Text>
                    </View>
                )}
            </ScrollView>

            {/* Full screen loading indicator */}
            {loading && activities.length === 0 && (
                <View style={styles.fullScreenLoading}>
                    <ActivityIndicator size="large" color="#04714A" />
                </View>
            )}
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0F0F0F", // Dark theme background
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
        paddingTop: Platform.OS === 'ios' ? 50 : 20,
        backgroundColor: '#0F0F0F',
    },
    title: {
        fontFamily: 'Inter-Black',
        fontSize: 20,
        flex: 1,
        fontWeight: '800',
        textAlign: 'center',
        color: '#FFB700', // Cyberpunk neon yellow
    },
    backButton: {
        backgroundColor: '#1E1E1E',
        padding: 8,
        borderRadius: 10,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backButton2: {
        padding: 8,
        borderRadius: 10,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContainer: {
        padding: 16,
        paddingBottom: 32,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: '#FF4A4A',
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    retryButton: {
        backgroundColor: '#FFB700',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    retryButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    loadingMoreContainer: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    endOfListContainer: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    endOfListText: {
        color: '#B0B0B0',
        fontSize: 14,
    },
    fullScreenLoading: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
});
