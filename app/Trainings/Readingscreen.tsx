import React, { useState, useEffect } from "react";
import {
    View,
    Pressable,
    Text,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import activitiesData from "@/Data/activity";
import { ActivityType } from "@/types/activitycard.types";
import ImageSlider from "@/components/ImageSlider";
import ReadingSheet from "@/components/ReadingSheet";

const { width } = Dimensions.get("window");

export default function ActivityDetailScreen() {
    const { id } = useLocalSearchParams();
    const [activity, setActivity] = useState<ActivityType | undefined>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const found = activitiesData.find((item) => item.id === id);
        setActivity({...found} as ActivityType);
        setLoading(false);
    }, [id]);

    if (loading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#04714A" />
            </View>
        );
    }

    if (!activity) {
        return (
            <View style={[styles.container, styles.center]}>
                <Text style={styles.errorText}>Activity not found</Text>
                <TouchableOpacity onPress={() => router.back()} style={styles.retryButton}>
                    <Text style={styles.retryButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const images = activity.imagepath
        ? Array.isArray(activity.imagepath)
            ? activity.imagepath
            : [activity.imagepath]
        : [activity.image]; // fallback to single image

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1, backgroundColor: "#0F0F0F" }}
        >
            // 
            <View style={styles.header}>
                <Pressable
                    onPress={() => {
                        if (router && typeof router.back === "function") {
                            router.back();
                        } else {
                            console.error("router.back is not a function or router is undefined");
                        }
                    }}
                    style={styles.backButton}
                >
                    <AntDesign name="arrowleft" size={24} color="white" />
                </Pressable>
            </View>

            <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
                <ImageSlider images={images} />

                
                <Text style={[styles.contentTitle]} numberOfLines={3}>
                    {activity.title}
                </Text>
                
                <Text style={styles.contentTitle}>{activity.name}</Text>

                {/* Reading-style description */}
                <ReadingSheet content={activity.description} />

                {activity.activityDescription && (
                    <>
                        <Text style={styles.sectionTitle}>More About It</Text>
                        <ReadingSheet content={activity.activityDescription} />
                    </>
                )}

                {activity.steps?.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>Steps</Text>
                        {activity.steps.map((step, idx) => (
                            <View key={idx} style={styles.stepContainer}>
                                <View style={styles.stepNumber}>
                                    <Text style={styles.stepNumberText}>{idx + 1}</Text>
                                </View>
                                <Text style={styles.stepText}>{step}</Text>
                            </View>
                        ))}
                    </>
                )}
                <View style={{ height: 20 }} />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0F0F0F",
    },
    center: {
        justifyContent: "center",
        alignItems: "center",
    },
    scrollContainer: { flex: 1 },
    scrollContent: { paddingBottom: 60 },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: Platform.OS === "ios" ? 50 : 20,
        paddingHorizontal: 14,
        backgroundColor: "transparent",
        position: "absolute",
        zIndex : 5,
    },
    title: {
        flex: 1,
        color: "#FFF",
        textAlign: "center",
        fontSize: 16,
        fontWeight: "600",
    },
    backButton: {
        backgroundColor: "#292929",
        padding: 8,
        borderRadius: 8,
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
    },
    episodeText: {
        fontSize: 14,
        color: "#FFB700",
        fontWeight: "600",
        paddingHorizontal: 20,
        marginTop: 10,
    },
    contentTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#FFFFFF",
        paddingHorizontal: 20,
        marginVertical: 12,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#FFB700",
        paddingHorizontal: 20,
        marginTop: 16,
        marginBottom: 8,
    },
    stepContainer: {
        flexDirection: "row",
        paddingHorizontal: 20,
        marginBottom: 12,
    },
    stepNumber: {
        backgroundColor: "#FFB700",
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },
    stepNumberText: {
        color: "#0F0F0F",
        fontWeight: "bold",
    },
    stepText: {
        color: "#B0B0B0",
        fontSize: 16,
        flex: 1,
        lineHeight: 22,
    },
    errorText: {
        color: "#FF3B30",
        fontSize: 16,
        marginBottom: 16,
        textAlign: "center",
    },
    retryButton: {
        backgroundColor: "#FFB700",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    retryButtonText: {
        color: "#0F0F0F",
        fontWeight: "bold",
    },
});
