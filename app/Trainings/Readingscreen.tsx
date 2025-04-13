import React, { useState, useEffect } from "react";
import {
    View,
    Pressable,
    Text,
    Image,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    ActivityIndicator
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import ActivityService from "@/lib/activity";
import { ActivityType } from "@/types/activitycard.types";

const { width } = Dimensions.get('window');
const IMAGE_HEIGHT = (width * 9) / 16; // 16:9 aspect ratio

export default function ActivityDetailScreen() {
    const { id } = useLocalSearchParams();
    const [activity, setActivity] = useState<ActivityType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                setLoading(true);
                setError(null);

                if (typeof id !== 'string') {
                    throw new Error('Invalid activity ID');
                }

                const fetchedActivity = await ActivityService.getActivityById(id);
                setActivity(fetchedActivity);
            } catch (err) {
                console.error('Error fetching activity:', err);
                setError('Failed to load activity. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchActivity();
    }, [id]);

    if (loading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color="#04714A" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={[styles.container, styles.errorContainer]}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.retryButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (!activity) {
        return (
            <View style={[styles.container, styles.errorContainer]}>
                <Text style={styles.errorText}>Activity not found</Text>
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.retryButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1, backgroundColor: "#0F0F0F" }}
        >
            {/* Sticky Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <AntDesign name="arrowleft" size={24} color="white" />
                </Pressable>
                <Text style={[styles.title, { textAlign: 'center' }]}>{activity.title}</Text>
                <TouchableOpacity style={styles.backButton}>
                    <Feather name="send" size={20} color={"#ffffff"} />
                </TouchableOpacity>
            </View>

            {/* Scrollable Content */}
            <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={{ paddingHorizontal: 14 }}>
                    {/* 16:9 Image at the top */}
                    <Image
                        source={{ uri: activity.imagepath[0] }} // Using the image from API
                        style={styles.topImage}
                        resizeMode="contain"
                    />
                </View>

                {/* Activity Type */}
                <Text style={styles.episodeText}>Type: {activity.type}</Text>

                {/* Title */}
                <Text style={styles.contentTitle}>{activity.name}</Text>

                {/* Description */}
                <Text style={styles.description}>
                    {activity.description}
                </Text>

                {/* Additional Activity Details */}
                {activity.activityDescription && (
                    <>
                        <Text style={styles.sectionTitle}>About This Activity</Text>
                        <Text style={styles.description}>
                            {activity.activityDescription}
                        </Text>
                    </>
                )}

                {/* Steps if available */}
                {activity.steps && activity.steps.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>Steps</Text>
                        {activity.steps.map((step: string, index: number) => (
                            <View key={index} style={styles.stepContainer}>
                                <View style={styles.stepNumber}>
                                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                                </View>
                                <Text style={styles.stepText}>{step}</Text>
                            </View>
                        ))}
                    </>
                )}

                {/* Spacer for the sticky button */}
                <View style={styles.spacer} />
            </ScrollView>

            {/* Sticky Button at Bottom 
            <View style={styles.stickyButtonContainer}>
                <TouchableOpacity style={styles.continueButton}>
                    <Text style={styles.continueButtonText}>
                        {activity.activitytype === 'Read' ? 'Mark as Read' : 'Start Activity'}
                    </Text>
                </TouchableOpacity>
            </View>

            */}

        </KeyboardAvoidingView>
    );
}
const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 80, // Space for sticky button
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
        paddingTop: Platform.OS === 'ios' ? 50 : 20,
        zIndex: 1,
        backgroundColor: '#0F0F0F',
    },
    title: {
        fontFamily: 'Inter-Black',
        fontSize: 16,
        fontWeight: "600",
        flex: 1,
        textAlign: 'center',
        color: '#FFFFFF',
    },
    backButton: {
        backgroundColor: '#292929',
        padding: 8,
        borderRadius: 8,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    topImage: {
        width: '100%',
        height: IMAGE_HEIGHT,
    },
    episodeText: {
        fontSize: 14,
        color: '#FFB700',
        fontWeight: '600',
        paddingHorizontal: 20,
        marginBottom: 8,
    },
    contentTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        color: '#B0B0B0',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    spacer: {
        height: 20,
    },
    stickyButtonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
    },
    continueButton: {
        backgroundColor: '#FFB700',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#FFB700',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 6,
    },
    continueButtonText: {
        color: '#0F0F0F',
        fontSize: 18,
        fontWeight: '600',
    },
    container: {
        flex: 1,
        backgroundColor: '#0F0F0F',
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0F0F0F',
    },
    errorContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#0F0F0F',
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    retryButton: {
        backgroundColor: '#FFB700',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    retryButtonText: {
        color: '#0F0F0F',
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFB700',
        paddingHorizontal: 20,
        marginTop: 16,
        marginBottom: 8,
    },
    stepContainer: {
        flexDirection: 'row',
        marginBottom: 15,
        paddingHorizontal: 20,
        alignItems: 'flex-start',
    },
    stepNumber: {
        backgroundColor: '#FFB700',
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    stepNumberText: {
        color: '#0F0F0F',
        fontWeight: 'bold',
    },
    stepText: {
        flex: 1,
        fontSize: 16,
        lineHeight: 22,
        color: '#B0B0B0',
    },
});
